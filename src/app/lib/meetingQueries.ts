import type { SupabaseSession } from './supabaseAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

type MeetingRow = {
  id: string;
  title: string | null;
  duration_minutes: number | null;
  language: string | null;
  status: string | null;
  created_at: string;
  platform?: string | null;
};

type MeetingMetricRow = {
  meeting_id: string;
  productivity_score: number | null;
  participation_score: number | null;
  clarity_score: number | null;
  action_density: number | null;
  decision_density: number | null;
};

type DecisionRow = {
  meeting_id: string;
  decision: string;
  confidence: number | null;
  source_text: string | null;
  created_at: string;
};

type ActionRow = {
  meeting_id: string;
  task: string;
  owner: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
  confidence: number | null;
  source_text: string | null;
  created_at: string;
};

type TranscriptRow = {
  meeting_id: string;
  full_text: string | null;
  segments: Array<{
    text: string;
    start: number;
    end: number;
    speaker: number | null;
    language: string | null;
    confidence: number | null;
  }> | null;
};

type InsightRow = {
  meeting_id: string;
  insight: string;
  category: string | null;
  confidence: number | null;
  source_text: string | null;
};

type RiskRow = {
  meeting_id: string;
  risk: string;
  severity: string | null;
  type: string | null;
  confidence: number | null;
  source_text: string | null;
};

type SpeakerStatRow = {
  meeting_id: string;
  speaker: string;
  talk_ratio: number | null;
};

export type MeetingListItem = {
  id: string;
  name: string;
  participants: number;
  duration: number;
  score: number;
  decisions: number;
  actions: number;
  date: string;
  participantNames: string[];
  platform: 'zoom' | 'teams' | 'meet' | 'upload';
};

export type MeetingDetailData = MeetingListItem & {
  language: string | null;
  status: string | null;
  summary: string;
  highlights: string[];
  risks: Array<{
    text: string;
    severity: string | null;
    type: string | null;
  }>;
  transcript: Array<{ speaker: string; text: string; time: string }>;
  decisionsList: Array<{
    decision: string;
    confidence: number;
    sourceText: string | null;
  }>;
  actionsList: Array<{
    task: string;
    owner: string | null;
    dueDate: string | null;
    priority: string | null;
    status: string;
    confidence: number;
    sourceText: string | null;
  }>;
  participationScore: number;
  clarityScore: number;
};

function assertConfigured() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase ayarlari eksik. VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanimlayin.');
  }
}

function getHeaders(session: SupabaseSession) {
  assertConfigured();

  return {
    apikey: supabaseAnonKey!,
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

async function request<T>(session: SupabaseSession, path: string) {
  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    headers: getHeaders(session),
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; hint?: string; details?: string })
    | null;

  if (!response.ok) {
    const message =
      data?.message ??
      data?.hint ??
      data?.details ??
      'Supabase sorgusu basarisiz oldu.';
    throw new Error(message);
  }

  return data as T;
}

function formatTimestamp(seconds: number) {
  const totalSeconds = Math.max(0, seconds);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const remaining = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function asPlatform(value: string | null | undefined): 'zoom' | 'teams' | 'meet' | 'upload' {
  if (value === 'zoom' || value === 'teams' || value === 'meet' || value === 'upload') {
    return value;
  }

  return 'upload';
}

function getMeetingName(meeting: MeetingRow) {
  return meeting.title?.trim() || 'Untitled Meeting';
}

function mapTranscriptSegments(segments: TranscriptRow['segments']) {
  return (segments ?? []).map((segment) => ({
    speaker: segment.speaker !== null && segment.speaker !== undefined
      ? `Speaker ${segment.speaker + 1}`
      : 'Speaker',
    text: segment.text,
    time: formatTimestamp(segment.start),
  }));
}

function groupByMeetingId<T extends { meeting_id: string }>(rows: T[]) {
  return rows.reduce<Record<string, T[]>>((acc, row) => {
    acc[row.meeting_id] = acc[row.meeting_id] ?? [];
    acc[row.meeting_id].push(row);
    return acc;
  }, {});
}

export async function fetchWorkspaceMeetings(session: SupabaseSession, workspaceId: string): Promise<MeetingListItem[]> {
  const meetings = await request<MeetingRow[]>(
    session,
    `/meetings?select=id,title,duration_minutes,language,status,created_at,platform&workspace_id=eq.${encodeURIComponent(workspaceId)}&order=created_at.desc`
  );

  if (meetings.length === 0) {
    return [];
  }

  const ids = meetings.map((meeting) => meeting.id).join(',');
  const [metrics, decisions, actions, speakerStats] = await Promise.all([
    request<MeetingMetricRow[]>(session, `/meeting_metrics?select=meeting_id,productivity_score,participation_score,clarity_score,action_density,decision_density&meeting_id=in.(${ids})`),
    request<DecisionRow[]>(session, `/decisions?select=meeting_id,decision,confidence,source_text,created_at&meeting_id=in.(${ids})`),
    request<ActionRow[]>(session, `/actions?select=meeting_id,task,owner,due_date,priority,status,confidence,source_text,created_at&meeting_id=in.(${ids})`),
    request<SpeakerStatRow[]>(session, `/speaker_stats?select=meeting_id,speaker,talk_ratio&meeting_id=in.(${ids})`),
  ]);

  const metricMap = new Map(metrics.map((metric) => [metric.meeting_id, metric]));
  const decisionsMap = groupByMeetingId(decisions);
  const actionsMap = groupByMeetingId(actions);
  const speakersMap = groupByMeetingId(speakerStats);

  return meetings.map((meeting) => {
    const speakerRows = speakersMap[meeting.id] ?? [];
    const participantNames = speakerRows.map((speaker) => speaker.speaker);

    return {
      id: meeting.id,
      name: getMeetingName(meeting),
      participants: participantNames.length,
      duration: meeting.duration_minutes ?? 0,
      score: metricMap.get(meeting.id)?.productivity_score ?? 0,
      decisions: (decisionsMap[meeting.id] ?? []).length,
      actions: (actionsMap[meeting.id] ?? []).length,
      date: meeting.created_at,
      participantNames,
      platform: asPlatform(meeting.platform),
    };
  });
}

export async function fetchMeetingDetail(session: SupabaseSession, meetingId: string): Promise<MeetingDetailData | null> {
  const meetings = await request<MeetingRow[]>(
    session,
    `/meetings?select=id,title,duration_minutes,language,status,created_at,platform&id=eq.${encodeURIComponent(meetingId)}&limit=1`
  );

  const meeting = meetings[0];

  if (!meeting) {
    return null;
  }

  const [metrics, decisions, actions, transcripts, insights, risks, speakerStats] = await Promise.all([
    request<MeetingMetricRow[]>(session, `/meeting_metrics?select=meeting_id,productivity_score,participation_score,clarity_score,action_density,decision_density&meeting_id=eq.${encodeURIComponent(meetingId)}&limit=1`),
    request<DecisionRow[]>(session, `/decisions?select=meeting_id,decision,confidence,source_text,created_at&meeting_id=eq.${encodeURIComponent(meetingId)}&order=created_at.asc`),
    request<ActionRow[]>(session, `/actions?select=meeting_id,task,owner,due_date,priority,status,confidence,source_text,created_at&meeting_id=eq.${encodeURIComponent(meetingId)}&order=created_at.asc`),
    request<TranscriptRow[]>(session, `/transcripts?select=meeting_id,full_text,segments&meeting_id=eq.${encodeURIComponent(meetingId)}&limit=1`),
    request<InsightRow[]>(session, `/insights?select=meeting_id,insight,category,confidence,source_text&meeting_id=eq.${encodeURIComponent(meetingId)}`),
    request<RiskRow[]>(session, `/risks?select=meeting_id,risk,severity,type,confidence,source_text&meeting_id=eq.${encodeURIComponent(meetingId)}`),
    request<SpeakerStatRow[]>(session, `/speaker_stats?select=meeting_id,speaker,talk_ratio&meeting_id=eq.${encodeURIComponent(meetingId)}`),
  ]);

  const metric = metrics[0];
  const transcript = transcripts[0];
  const summaryInsight = insights.find((item) => item.category === 'summary');
  const highlightInsights = insights.filter((item) => item.category === 'highlight');
  const participantNames = speakerStats.map((speaker) => speaker.speaker);

  return {
    id: meeting.id,
    name: getMeetingName(meeting),
    participants: participantNames.length,
    duration: meeting.duration_minutes ?? 0,
    score: metric?.productivity_score ?? 0,
    decisions: decisions.length,
    actions: actions.length,
    date: meeting.created_at,
    participantNames,
    platform: asPlatform(meeting.platform),
    language: meeting.language,
    status: meeting.status,
    summary: summaryInsight?.insight ?? 'No summary available.',
    highlights: highlightInsights.map((item) => item.insight),
    risks: risks.map((risk) => ({
      text: risk.risk,
      severity: risk.severity,
      type: risk.type,
    })),
    transcript: mapTranscriptSegments(transcript?.segments ?? null),
    decisionsList: decisions.map((decision) => ({
      decision: decision.decision,
      confidence: decision.confidence ?? 0,
      sourceText: decision.source_text,
    })),
    actionsList: actions.map((action) => ({
      task: action.task,
      owner: action.owner,
      dueDate: action.due_date,
      priority: action.priority,
      status: action.status ?? 'pending',
      confidence: action.confidence ?? 0,
      sourceText: action.source_text,
    })),
    participationScore: metric?.participation_score ?? 0,
    clarityScore: metric?.clarity_score ?? 0,
  };
}
