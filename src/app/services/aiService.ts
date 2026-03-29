// aiService.ts — OpenAI-powered meeting analysis

import { formatTimestamp, type TranscriptUtterance } from './gladiaService';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY?.trim();
const OPENAI_BASE = 'https://api.openai.com/v1';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface MeetingAction {
  task: string;
  owner: string | null;
  due_date: string | null;
  priority: 'high' | 'medium' | 'low' | null;
  status: 'pending';
  confidence: number;
  source_text: string;
}

export interface MeetingDecision {
  decision: string;
  confidence: number;
  source_text: string;
}

export interface MeetingAnalysis {
  summary: {
    short_summary: string;
    bullet_summary: string[];
  };
  actions: MeetingAction[];
  decisions: MeetingDecision[];
  metrics: {
    meeting_duration_minutes: number;
    speaker_distribution: Array<{ speaker: string; talk_time_ratio: number }>;
    participation_score: number;
    productivity_score: number;
  };
}

// ─── Prompt constants ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are MeetInsight AI, an enterprise-grade meeting analysis engine.
Analyze the meeting transcript and return ONLY valid JSON.
Rules:
- No markdown, no explanations, no text outside JSON
- Do not hallucinate names, deadlines, or decisions
- Only extract what is explicitly stated in the transcript
- If owner or due date is not explicitly mentioned, return null
- status for all actions must be "pending"
- confidence must be a number between 0 and 1
- source_text must contain the exact or near-exact supporting phrase from the transcript
- Preserve the original language of the transcript for extracted content`;

const JSON_SCHEMA = `{
  "summary": {
    "short_summary": "string",
    "bullet_summary": ["string"]
  },
  "actions": [
    {
      "task": "string",
      "owner": "string or null",
      "due_date": "string or null",
      "priority": "high | medium | low | null",
      "status": "pending",
      "confidence": 0.0,
      "source_text": "string"
    }
  ],
  "decisions": [
    {
      "decision": "string",
      "confidence": 0.0,
      "source_text": "string"
    }
  ],
  "metrics": {
    "meeting_duration_minutes": 0,
    "speaker_distribution": [
      { "speaker": "string", "talk_time_ratio": 0.0 }
    ],
    "participation_score": 0,
    "productivity_score": 0
  }
}`;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildTranscriptText(utterances: TranscriptUtterance[], fullText: string): string {
  if (utterances.length === 0) return fullText;
  return utterances
    .map((u) => `[Speaker ${(u.speaker ?? 0) + 1} ${formatTimestamp(u.start)}]: ${u.text}`)
    .join('\n');
}

async function callOpenAI(userMessage: string): Promise<string> {
  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `OpenAI API error (${res.status})`);
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0].message.content;
}

async function repairJSON(badOutput: string): Promise<string> {
  const repairMessage = `Your previous response was invalid JSON. Repair it and return ONLY valid JSON.
Do not add explanations. Preserve all extracted information.
If a field is missing, use null or [] according to the schema.

Invalid output:
${badOutput}

Target schema:
${JSON_SCHEMA}`;

  return callOpenAI(repairMessage);
}

function normalize(parsed: Record<string, unknown>): MeetingAnalysis {
  const summary = (parsed.summary ?? {}) as Record<string, unknown>;
  const metrics = (parsed.metrics ?? {}) as Record<string, unknown>;

  return {
    summary: {
      short_summary: (summary.short_summary as string) ?? 'No summary available.',
      bullet_summary: Array.isArray(summary.bullet_summary)
        ? (summary.bullet_summary as string[])
        : [],
    },
    actions: Array.isArray(parsed.actions)
      ? (parsed.actions as Array<Record<string, unknown>>).map((a) => ({
          task: (a.task as string) ?? '',
          owner: (a.owner as string | null) ?? null,
          due_date: (a.due_date as string | null) ?? null,
          priority: (['high', 'medium', 'low'].includes(a.priority as string)
            ? a.priority
            : null) as 'high' | 'medium' | 'low' | null,
          status: 'pending' as const,
          confidence: typeof a.confidence === 'number' ? a.confidence : 0.5,
          source_text: (a.source_text as string) ?? '',
        }))
      : [],
    decisions: Array.isArray(parsed.decisions)
      ? (parsed.decisions as Array<Record<string, unknown>>).map((d) => ({
          decision: (d.decision as string) ?? '',
          confidence: typeof d.confidence === 'number' ? d.confidence : 0.5,
          source_text: (d.source_text as string) ?? '',
        }))
      : [],
    metrics: {
      meeting_duration_minutes:
        typeof metrics.meeting_duration_minutes === 'number'
          ? metrics.meeting_duration_minutes
          : 0,
      speaker_distribution: Array.isArray(metrics.speaker_distribution)
        ? (metrics.speaker_distribution as Array<Record<string, unknown>>).map((s) => ({
            speaker: (s.speaker as string) ?? 'Unknown',
            talk_time_ratio: typeof s.talk_time_ratio === 'number' ? s.talk_time_ratio : 0,
          }))
        : [],
      participation_score:
        typeof metrics.participation_score === 'number' ? metrics.participation_score : 0,
      productivity_score:
        typeof metrics.productivity_score === 'number' ? metrics.productivity_score : 0,
    },
  };
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function isAIConfigured(): boolean {
  return Boolean(OPENAI_API_KEY);
}

export async function analyzeMeeting(
  fullText: string,
  utterances: TranscriptUtterance[]
): Promise<MeetingAnalysis> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      'OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.'
    );
  }

  const transcriptText = buildTranscriptText(utterances, fullText);

  const userMessage = `Analyze the following meeting transcript and return ONLY valid JSON using this schema:\n\n${JSON_SCHEMA}\n\nTranscript:\n${transcriptText}`;

  let raw = await callOpenAI(userMessage);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // Repair pass
    raw = await repairJSON(raw);
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      throw new Error('AI returned invalid JSON after repair attempt. Please try again.');
    }
  }

  const analysis = normalize(parsed);

  // Log structured output to console as requested
  console.log('[MeetInsight AI] === MEETING ANALYSIS ===');
  console.log(JSON.stringify(analysis, null, 2));
  console.log('[MeetInsight AI] =========================');

  return analysis;
}
