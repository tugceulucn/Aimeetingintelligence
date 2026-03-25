// gladiaService.ts — Gladia STT API integration

const GLADIA_API_KEY = '32f9834a-34a2-45cc-ae21-a81e922629c7';
const GLADIA_BASE = 'https://api.gladia.io/v2';

export interface TranscriptUtterance {
  text: string;
  start: number;
  end: number;
  speaker?: number;
  language?: string;
  confidence?: number;
}

export interface TranscriptionResult {
  id: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  utterances: TranscriptUtterance[];
  fullText: string;
  language?: string;
  errorMessage?: string;
}

// Upload audio/video file, returns audio_url
export async function uploadAudioFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('audio', file);

  const res = await fetch(`${GLADIA_BASE}/upload`, {
    method: 'POST',
    headers: { 'x-gladia-key': GLADIA_API_KEY },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  if (!data.audio_url) throw new Error('No audio_url in upload response.');
  return data.audio_url as string;
}

// Start pre-recorded transcription with speaker diarization
export async function startTranscription(audioUrl: string): Promise<{ id: string }> {
  const res = await fetch(`${GLADIA_BASE}/pre-recorded`, {
    method: 'POST',
    headers: {
      'x-gladia-key': GLADIA_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      diarization: true,
      diarization_config: { min_speakers: 1, max_speakers: 10 },
      sentences: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to start transcription (${res.status})`);
  }

  const data = await res.json();
  if (!data.id) throw new Error('No transcription id returned.');
  return { id: data.id as string };
}

// Poll every 2s until done or error (max 4 minutes)
export async function pollTranscription(id: string): Promise<TranscriptionResult> {
  const MAX = 120;

  for (let i = 0; i < MAX; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const res = await fetch(`${GLADIA_BASE}/pre-recorded/${id}`, {
      headers: { 'x-gladia-key': GLADIA_API_KEY },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Polling failed (${res.status})`);
    }

    const data = await res.json();

    if (data.status === 'done') {
      const raw: Array<Record<string, unknown>> =
        data?.result?.transcription?.utterances ?? [];

      const utterances: TranscriptUtterance[] = raw.map((u) => ({
        text: (u.text as string) ?? '',
        start: (u.start as number) ?? 0,
        end: (u.end as number) ?? 0,
        speaker: u.speaker !== undefined ? (u.speaker as number) : undefined,
        language: u.language !== undefined ? (u.language as string) : undefined,
        confidence: u.confidence !== undefined ? (u.confidence as number) : undefined,
      }));

      return {
        id,
        status: 'done',
        utterances,
        fullText: utterances.map((u) => u.text).join(' '),
        language: (data?.result?.transcription?.languages as string[] | undefined)?.[0],
      };
    }

    if (data.status === 'error') {
      throw new Error(String(data.error_code ?? data.message ?? 'Transcription failed.'));
    }
  }

  throw new Error('Transcription timed out after 4 minutes. Please try again.');
}

// Format seconds → MM:SS.mmm
export function formatTimestamp(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toFixed(3).padStart(6, '0');
  return `${m}:${sec}`;
}
