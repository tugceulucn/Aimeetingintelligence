import type { MeetingAnalysis } from '../services/aiService';
import type { TranscriptUtterance } from '../services/gladiaService';
import type { AppWorkspace, SupabaseSession } from './supabaseAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

type SaveMeetingRecordingInput = {
  session: SupabaseSession;
  workspace: AppWorkspace;
  fileName: string;
  transcriptText: string;
  utterances: TranscriptUtterance[];
  language?: string;
  durationSeconds?: number;
  analysis: MeetingAnalysis;
};

function assertConfigured() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase ayarlari eksik. VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanimlayin.');
  }
}

function getMeetingTitle(fileName: string) {
  const trimmed = fileName.trim();
  const title = trimmed.replace(/\.[^/.]+$/, '');
  return title || 'Untitled Meeting';
}

function getDurationMinutes(durationSeconds?: number, analysis?: MeetingAnalysis) {
  if (typeof durationSeconds === 'number' && durationSeconds > 0) {
    return Math.max(1, Math.round(durationSeconds / 60));
  }

  if (analysis?.metrics.meeting_duration_minutes) {
    return analysis.metrics.meeting_duration_minutes;
  }

  return 0;
}

function clampScore(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getClarityScore(analysis: MeetingAnalysis) {
  const scores = [
    analysis.metrics.productivity_score,
    analysis.metrics.participation_score,
  ].filter((value) => typeof value === 'number' && !Number.isNaN(value));

  if (scores.length === 0) {
    return 0;
  }

  return clampScore(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

function buildSegments(utterances: TranscriptUtterance[]) {
  return utterances.map((utterance) => ({
    text: utterance.text,
    start: utterance.start,
    end: utterance.end,
    speaker: utterance.speaker ?? null,
    language: utterance.language ?? null,
    confidence: utterance.confidence ?? null,
  }));
}

function buildDecisions(analysis: MeetingAnalysis) {
  return analysis.decisions
    .filter((decision) => decision.decision.trim())
    .map((decision) => ({
      decision: decision.decision.trim(),
      confidence: decision.confidence,
      source_text: decision.source_text,
    }));
}

function buildActions(analysis: MeetingAnalysis) {
  return analysis.actions
    .filter((action) => action.task.trim())
    .map((action) => ({
      task: action.task.trim(),
      owner: action.owner?.trim() || null,
      due_date: action.due_date,
      priority: action.priority,
      status: action.status,
      confidence: action.confidence,
      source_text: action.source_text,
    }));
}

function buildSpeakerStats(analysis: MeetingAnalysis) {
  return analysis.metrics.speaker_distribution
    .filter((speaker) => speaker.speaker.trim())
    .map((speaker) => ({
      speaker: speaker.speaker.trim(),
      talk_ratio: speaker.talk_time_ratio,
    }));
}

function buildInsights(analysis: MeetingAnalysis) {
  const insights: Array<{
    insight: string;
    category: string;
    confidence: number;
    source_text: string;
  }> = [];

  if (analysis.summary.short_summary.trim()) {
    insights.push({
      insight: analysis.summary.short_summary.trim(),
      category: 'summary',
      confidence: 0.95,
      source_text: analysis.summary.short_summary.trim(),
    });
  }

  analysis.summary.bullet_summary
    .filter((item) => item.trim())
    .forEach((item) => {
      insights.push({
        insight: item.trim(),
        category: 'highlight',
        confidence: 0.9,
        source_text: item.trim(),
      });
    });

  return insights;
}

function buildRisks(analysis: MeetingAnalysis) {
  return analysis.risks
    .filter((risk) => risk.risk.trim())
    .map((risk) => ({
      risk: risk.risk.trim(),
      severity: risk.severity,
      type: risk.type,
      confidence: risk.confidence,
      source_text: risk.source_text,
    }));
}

export async function saveMeetingRecording({
  session,
  workspace,
  fileName,
  transcriptText,
  utterances,
  language,
  durationSeconds,
  analysis,
}: SaveMeetingRecordingInput) {
  assertConfigured();

  const durationMinutes = getDurationMinutes(durationSeconds, analysis);
  const actionDensity = durationMinutes > 0 ? analysis.actions.length / durationMinutes : 0;
  const decisionDensity = durationMinutes > 0 ? analysis.decisions.length / durationMinutes : 0;

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/save_uploaded_meeting`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_workspace_id: workspace.id,
      p_uploaded_by_user_id: session.user.id,
      p_title: getMeetingTitle(fileName),
      p_source_file_name: fileName,
      p_platform: 'upload',
      p_duration_minutes: durationMinutes,
      p_language: language ?? null,
      p_status: 'analyzed',
      p_full_text: transcriptText,
      p_segments: buildSegments(utterances),
      p_productivity_score: clampScore(analysis.metrics.productivity_score),
      p_participation_score: clampScore(analysis.metrics.participation_score),
      p_clarity_score: getClarityScore(analysis),
      p_action_density: Number(actionDensity.toFixed(4)),
      p_decision_density: Number(decisionDensity.toFixed(4)),
      p_decisions: buildDecisions(analysis),
      p_actions: buildActions(analysis),
      p_speaker_stats: buildSpeakerStats(analysis),
      p_insights: buildInsights(analysis),
      p_risks: buildRisks(analysis),
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | string
    | { message?: string; hint?: string; details?: string }
    | null;

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data?.message) ||
      (typeof data === 'object' && data?.hint) ||
      (typeof data === 'object' && data?.details) ||
      'Toplanti verileri Supabase uzerine kaydedilemedi.';
    throw new Error(message);
  }

  return {
    meetingId: typeof data === 'string' ? data : null,
  };
}
