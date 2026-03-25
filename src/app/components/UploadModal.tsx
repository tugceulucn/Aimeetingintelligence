// UploadModal.tsx — Gladia-powered recording upload & transcription modal

import { useState, useRef, useCallback } from 'react';
import {
  X, FileAudio, Upload, RefreshCw, AlertCircle,
  CheckCircle, Copy, Download, Clock, Languages, User,
} from 'lucide-react';
import { useApp, useThemeColors } from '../context/AppContext';
import {
  uploadAudioFile,
  startTranscription,
  pollTranscription,
  formatTimestamp,
  TranscriptUtterance,
} from '../services/gladiaService';

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadStatus = 'idle' | 'uploading' | 'transcribing' | 'done' | 'error';

interface TranscriptResult {
  fullText: string;
  utterances: TranscriptUtterance[];
  language?: string;
  duration?: number;
  fileName: string;
}

// ─── Speaker color palette ────────────────────────────────────────────────────

const SPEAKER_COLORS = ['#a78bfa', '#f472b6', '#34d399', '#60a5fa', '#fbbf24', '#f97316'];
const getSpeakerColor = (id: number) => SPEAKER_COLORS[id % SPEAKER_COLORS.length];

// ─── Animated waveform ────────────────────────────────────────────────────────

function Waveform() {
  const bars = [
    { delay: '0ms', h: 28 }, { delay: '100ms', h: 20 },
    { delay: '200ms', h: 36 }, { delay: '60ms', h: 24 },
    { delay: '160ms', h: 32 },
  ];
  return (
    <div className="flex items-end gap-1 h-10 justify-center">
      <style>{`
        @keyframes wavePulse {
          0%   { transform: scaleY(0.2); opacity: 0.5; }
          100% { transform: scaleY(1);   opacity: 1; }
        }
      `}</style>
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            width: 4, height: b.h, borderRadius: 2,
            background: 'linear-gradient(180deg,#6D28D9,#EC4899)',
            animationName: 'wavePulse', animationDuration: '0.8s',
            animationDelay: b.delay, animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out', animationDirection: 'alternate',
          }}
        />
      ))}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2 text-xs select-none" style={{ color: checked ? '#a78bfa' : 'rgba(255,255,255,0.35)' }}>
      <div className="relative w-8 h-4 rounded-full transition-all duration-200" style={{ background: checked ? '#6D28D9' : 'rgba(255,255,255,0.1)' }}>
        <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-200" style={{ left: checked ? '18px' : '2px' }} />
      </div>
      {label}
    </button>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export function UploadModal({ onClose }: Props) {
  const { t } = useApp();
  const tc = useThemeColors();
  const isLight = tc.isLight;

  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [showSpeakers, setShowSpeakers] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Theme tokens
  const modalBg    = isLight ? '#ffffff' : 'rgba(13,10,22,0.97)';
  const cardBg     = isLight ? 'rgba(109,40,217,0.04)' : 'rgba(255,255,255,0.04)';
  const border     = isLight ? 'rgba(109,40,217,0.15)' : 'rgba(255,255,255,0.08)';
  const textPrimary   = isLight ? '#111827' : 'rgba(255,255,255,0.9)';
  const textMuted  = isLight ? '#6B7280' : 'rgba(255,255,255,0.4)';

  // ── File handling ───────────────────────────────────────────────────────────

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      setErrorMsg('Please upload an audio or video file (MP3, WAV, M4A, MP4, WebM).');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setErrorMsg('');
    setProgress(10);
    setProgressLabel('Uploading file...');

    try {
      const audioUrl = await uploadAudioFile(file);

      setProgress(30);
      setProgressLabel('Starting transcription...');
      const { id } = await startTranscription(audioUrl);

      setStatus('transcribing');
      setProgress(40);
      setProgressLabel('Transcribing... this may take a moment');

      // Smoothly advance progress 40 → 90 while polling
      const ticker = setInterval(() => setProgress((p) => Math.min(p + 1, 90)), 2000);

      const transcription = await pollTranscription(id);
      clearInterval(ticker);

      setProgress(100);
      setProgressLabel('Done!');

      setResult({
        fullText: transcription.fullText,
        utterances: transcription.utterances,
        language: transcription.language,
        duration: transcription.utterances.at(-1)?.end,
        fileName: file.name,
      });

      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Transcription failed. Please try again.');
      setProgress(0);
    }
  }, []);

  // ── Drag handlers ───────────────────────────────────────────────────────────

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  // ── Copy transcript ─────────────────────────────────────────────────────────

  async function copyTranscript() {
    if (!result) return;
    const text = showSpeakers && result.utterances.length > 0
      ? result.utterances
          .map((u) => `[Speaker ${(u.speaker ?? 0) + 1}${showTimestamps ? ` ${formatTimestamp(u.start)}` : ''}]: ${u.text}`)
          .join('\n')
      : result.fullText;
    await navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }

  // ── Download as .txt ────────────────────────────────────────────────────────

  function downloadTranscript() {
    if (!result) return;
    const lines = [
      `File: ${result.fileName}`,
      `Date: ${new Date().toLocaleString()}`,
      result.language ? `Language: ${result.language.toUpperCase()}` : '',
      result.duration  ? `Duration: ${formatTimestamp(result.duration)}` : '',
      '',
      '--- TRANSCRIPT ---',
      '',
      result.utterances.length > 0
        ? result.utterances
            .map((u) => `[${formatTimestamp(u.start)} → ${formatTimestamp(u.end)}] Speaker ${(u.speaker ?? 0) + 1}: ${u.text}`)
            .join('\n\n')
        : result.fullText,
    ].filter(Boolean).join('\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines], { type: 'text/plain' }));
    a.download = `transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── Render helpers ──────────────────────────────────────────────────────────

  function renderBody() {
    // Processing
    if (status === 'uploading' || status === 'transcribing') {
      return (
        <div className="flex flex-col items-center gap-6 py-10">
          <Waveform />
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-xs mb-2" style={{ color: textMuted }}>
              <span>{progressLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#6D28D9,#EC4899)' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: textMuted }}>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Processing your recording...
          </div>
        </div>
      );
    }

    // Error
    if (status === 'error') {
      return (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <AlertCircle className="w-7 h-7" style={{ color: '#EF4444' }} />
          </div>
          <div>
            <p className="font-medium mb-1" style={{ color: textPrimary }}>Upload failed</p>
            <p className="text-sm" style={{ color: textMuted }}>{errorMsg}</p>
          </div>
          <button
            onClick={() => { setStatus('idle'); setErrorMsg(''); setProgress(0); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      );
    }

    // Transcript result
    if (status === 'done' && result) {
      const wordCount  = result.fullText.trim().split(/\s+/).filter(Boolean).length;
      const uniqueSpeakers = result.utterances.length > 0
        ? new Set(result.utterances.map((u) => u.speaker ?? 0)).size
        : 0;

      return (
        <div className="flex flex-col gap-0">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b" style={{ borderColor: border }}>
            <span className="flex items-center gap-1.5 text-xs truncate max-w-[180px]" style={{ color: textMuted }}>
              <FileAudio className="w-3.5 h-3.5 shrink-0" />
              {result.fileName}
            </span>
            {result.duration && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: textMuted }}>
                <Clock className="w-3.5 h-3.5" />
                {formatTimestamp(result.duration)}
              </span>
            )}
            {result.language && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(109,40,217,0.12)', color: '#a78bfa', border: '1px solid rgba(109,40,217,0.25)' }}>
                <Languages className="w-3 h-3" />
                {result.language.toUpperCase()}
              </span>
            )}
            {uniqueSpeakers > 0 && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(236,72,153,0.1)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.25)' }}>
                <User className="w-3 h-3" />
                {uniqueSpeakers} speaker{uniqueSpeakers !== 1 ? 's' : ''}
              </span>
            )}
            {/* Actions */}
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={copyTranscript}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border"
                style={{ borderColor: copySuccess ? 'rgba(52,211,153,0.4)' : border, color: copySuccess ? '#34d399' : textMuted, background: copySuccess ? 'rgba(52,211,153,0.08)' : 'transparent' }}
                title="Copy transcript"
              >
                {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={downloadTranscript}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border"
                style={{ borderColor: border, color: textMuted, background: 'transparent' }}
                title="Download .txt"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toggles */}
          {result.utterances.length > 0 && (
            <div className="flex items-center gap-5 px-5 py-2.5 border-b" style={{ borderColor: border }}>
              <Toggle checked={showSpeakers}    onChange={setShowSpeakers}    label="Show Speakers" />
              <Toggle checked={showTimestamps}  onChange={setShowTimestamps}  label="Timestamps" />
            </div>
          )}

          {/* Utterances */}
          <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: 340 }}>
            {result.utterances.length > 0 ? (
              <div className="flex flex-col gap-4">
                {result.utterances.map((u, i) => {
                  const color = getSpeakerColor(u.speaker ?? 0);
                  return (
                    <div key={i} className="flex flex-col gap-1">
                      {showSpeakers && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                          <span className="text-xs font-semibold" style={{ color }}> Speaker {(u.speaker ?? 0) + 1}</span>
                          {showTimestamps && (
                            <span className="text-xs" style={{ color: textMuted }}>{formatTimestamp(u.start)}</span>
                          )}
                        </div>
                      )}
                      {!showSpeakers && showTimestamps && (
                        <span className="text-xs" style={{ color: textMuted }}>{formatTimestamp(u.start)}</span>
                      )}
                      <p className="text-sm leading-relaxed pl-4" style={{ color: textPrimary }}>{u.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: textPrimary }}>{result.fullText}</p>
            )}
          </div>

          {/* Footer stats */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-t" style={{ borderColor: border }}>
            <span className="text-xs" style={{ color: textMuted }}>{wordCount} words</span>
            {result.utterances.length > 0 && (
              <span className="text-xs" style={{ color: textMuted }}>{result.utterances.length} utterances</span>
            )}
            <button
              onClick={() => { setStatus('idle'); setResult(null); setProgress(0); }}
              className="ml-auto text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: '#a78bfa', background: 'rgba(109,40,217,0.1)', border: '1px solid rgba(109,40,217,0.25)' }}
            >
              Upload another
            </button>
          </div>
        </div>
      );
    }

    // Idle — drag-drop zone
    return (
      <label
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center gap-5 cursor-pointer transition-all rounded-2xl mx-5 my-5"
        style={{
          border: `2px dashed ${isDragging ? '#6D28D9' : border}`,
          background: isDragging ? 'rgba(109,40,217,0.08)' : cardBg,
          minHeight: 280,
          display: 'flex',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(109,40,217,0.4)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = isDragging ? '#6D28D9' : border; }}
      >
        <input
          type="file"
          accept="audio/*,video/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) { handleFile(e.target.files[0]); e.target.value = ''; } }}
        />
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: isDragging ? 'rgba(109,40,217,0.2)' : 'rgba(109,40,217,0.08)', border: '1px solid rgba(109,40,217,0.3)' }}>
          <FileAudio className="w-8 h-8" style={{ color: '#a78bfa' }} />
        </div>
        <div className="text-center px-6">
          <p className="font-semibold text-base mb-1" style={{ color: textPrimary }}>
            {isDragging ? 'Drop it here!' : 'Drop your recording here'}
          </p>
          <p className="text-sm" style={{ color: textMuted }}>
            MP3, WAV, M4A, MP4, WebM • Supports multiple languages
          </p>
        </div>
        <div className="flex items-center gap-3 w-48">
          <div className="flex-1 h-px" style={{ background: border }} />
          <span className="text-xs" style={{ color: textMuted }}>or</span>
          <div className="flex-1 h-px" style={{ background: border }} />
        </div>
        <span
          className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(109,40,217,0.1)', color: '#a78bfa', border: '1px solid rgba(109,40,217,0.3)' }}
        >
          Browse files
        </span>
      </label>
    );
  }

  // ── Modal shell ─────────────────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: modalBg, border: `1px solid ${border}`, boxShadow: '0 25px 80px rgba(109,40,217,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: border }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6D28D9,#EC4899)' }}>
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: textPrimary }}>{t('topnav.upload')}</p>
              <p className="text-xs" style={{ color: textMuted }}>Powered by Gladia AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: textMuted }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {renderBody()}
      </div>
    </div>
  );
}
