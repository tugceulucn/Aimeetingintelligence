import { useParams, Link } from 'react-router';
import { useState } from 'react';
import {
  ArrowLeft, Users, Clock, Calendar, Video, MessageSquare,
  Users as UsersIcon, Flag, CheckSquare, AlertTriangle, TrendingUp,
} from 'lucide-react';
import { MeetingScoreBadge } from '../components/MeetingScoreBadge';
import { meetings } from '../data/mockData';
import { useApp, useThemeColors } from '../context/AppContext';

const platformIcons = { zoom: Video, meet: MessageSquare, teams: UsersIcon };
const platformColors: Record<string, string> = { zoom: '#2D8CFF', teams: '#5558AF', meet: '#34A853' };

export function MeetingDetail() {
  const { id } = useParams();
  const { t } = useApp();
  const tc = useThemeColors();

  // Theme-aware text tokens (replaces hardcoded dark-only constants)
  const DIM    = tc.textDim;
  const DIM2   = tc.textMuted;
  const WH     = tc.textPrimary;
  const BORDER = `1px solid ${tc.borderSubtle}`;

  const [activeTab, setActiveTab] = useState<'transcript' | 'insights' | 'decisions' | 'actions'>('insights');

  const meeting = meetings.find((m) => m.id === id);

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm" style={{ color: tc.textDim }}>Meeting not found</p>
          <Link to="/meetings" style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>
            Back to meetings
          </Link>
        </div>
      </div>
    );
  }

  const PlatformIcon = platformIcons[meeting.platform];
  const pColor = platformColors[meeting.platform] || '#6D28D9';

  const tabs = [
    { id: 'insights',   label: t('detail.insights'),   count: null },
    { id: 'transcript', label: t('detail.transcript'), count: meeting.transcript.length },
    { id: 'decisions',  label: t('detail.decisions'),  count: meeting.decisions },
    { id: 'actions',    label: t('detail.actions'),    count: meeting.actions },
  ] as const;

  const scoreColor = meeting.score >= 80 ? '#34d399' : meeting.score >= 70 ? '#a78bfa' : '#f87171';
  const circumference = 2 * Math.PI * 56;
  const progress = (meeting.score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/meetings"
        className="inline-flex items-center gap-2 text-sm transition-colors card-anim card-anim-1"
        style={{ color: DIM, fontWeight: 500 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = DIM; }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to meetings
      </Link>

      {/* Meeting Header */}
      <div className="glass-card rounded-2xl p-6 card-anim card-anim-2">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: WH, letterSpacing: '-0.02em' }}>
                {meeting.name}
              </h1>
              <MeetingScoreBadge score={meeting.score} size="md" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              {[
                { icon: Calendar, text: new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { icon: Clock, text: `${meeting.duration} minutes` },
                { icon: Users, text: `${meeting.participants} participants` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: DIM2 }} />
                  <span className="text-sm" style={{ color: DIM }}>{text}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: pColor, boxShadow: `0 0 6px ${pColor}99` }} />
                <PlatformIcon className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span className="text-sm capitalize" style={{ color: DIM }}>{meeting.platform}</span>
              </div>
            </div>

            {/* Participants */}
            <div className="mt-4 flex -space-x-2">
              {meeting.participantNames.map((name, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs text-white ring-2"
                  title={name}
                  style={{
                    background: `linear-gradient(135deg, ${['#6D28D9','#EC4899','#22D3EE','#7c3aed','#a855f7','#0891b2'][i % 6]}, ${['#EC4899','#22D3EE','#6D28D9','#a855f7','#6D28D9','#22D3EE'][i % 6]})`,
                    ringColor: '#0B0B0F',
                    fontWeight: 700,
                    fontSize: 10,
                  }}
                >
                  {name.split(' ').map((n) => n[0]).join('')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl p-1 w-fit card-anim card-anim-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: BORDER }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-200"
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg,#6D28D9,#EC4899)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : DIM,
              fontWeight: activeTab === tab.id ? 700 : 500,
              boxShadow: activeTab === tab.id ? '0 0 12px rgba(109,40,217,0.4)' : 'none',
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span
                className="rounded-full px-1.5 py-0.5 text-xs"
                style={{
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                  color: activeTab === tab.id ? '#fff' : DIM2,
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3 card-anim card-anim-4">
        {/* Main panel */}
        <div className="lg:col-span-2 space-y-4">

          {/* INSIGHTS */}
          {activeTab === 'insights' && (
            <>
              <div className="glass-card rounded-2xl p-6">
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 12 }}>AI Summary</h3>
                <p className="text-sm leading-relaxed" style={{ color: DIM }}>{meeting.summary}</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 16 }}>Key Highlights</h3>
                <ul className="space-y-3">
                  {meeting.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs text-white"
                        style={{ background: 'linear-gradient(135deg,#6D28D9,#EC4899)', fontWeight: 700, boxShadow: '0 0 8px rgba(109,40,217,0.4)' }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm" style={{ color: DIM, lineHeight: 1.6 }}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {meeting.risks.length > 0 && (
                <div className="glass-card rounded-2xl p-6" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.05)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5" style={{ color: '#f59e0b' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fbbf24' }}>Risk Detection</h3>
                  </div>
                  <ul className="space-y-2">
                    {meeting.risks.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(251,191,36,0.8)' }}>
                        <span style={{ color: '#f59e0b', marginTop: 2 }}>•</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="glass-card rounded-2xl p-6">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>Meeting Transcript</h3>
              <div className="space-y-4">
                {meeting.transcript.length > 0 ? (
                  meeting.transcript.map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <span
                        className="text-xs font-mono w-12 shrink-0 pt-0.5"
                        style={{ color: DIM2 }}
                      >
                        {item.time}
                      </span>
                      <div className="flex-1 rounded-xl p-3 transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,0.02)', border: BORDER }}>
                        <span className="text-sm" style={{ color: '#a78bfa', fontWeight: 700 }}>{item.speaker}:</span>
                        <span className="ml-2 text-sm" style={{ color: DIM }}>{item.text}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-12 text-sm" style={{ color: DIM2 }}>
                    Transcript not available for this meeting
                  </p>
                )}
              </div>
            </div>
          )}

          {/* DECISIONS */}
          {activeTab === 'decisions' && (
            <div className="glass-card rounded-2xl p-6">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>Decisions Made</h3>
              <div className="space-y-3">
                {Array.from({ length: meeting.decisions }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200"
                    style={{ background: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.2)', borderLeft: '3px solid #6D28D9' }}>
                    <Flag className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <div>
                      <p className="text-sm text-white" style={{ fontWeight: 600 }}>
                        {['Prioritize analytics dashboard for Q2 release', 'Hire additional frontend developers to meet timeline', 'Launch marketing campaign on June 15'][i] || `Decision ${i + 1}`}
                      </p>
                      <p className="text-xs mt-1" style={{ color: DIM2 }}>Decision made during discussion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          {activeTab === 'actions' && (
            <div className="glass-card rounded-2xl p-6">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>Action Items</h3>
              <div className="space-y-3">
                {meeting.participantNames.slice(0, meeting.actions).map((name, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-xl p-4 transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.03)', border: BORDER }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                    <div className="h-5 w-5 mt-0.5 rounded shrink-0"
                      style={{ border: '2px solid rgba(109,40,217,0.4)', background: 'transparent' }} />
                    <div className="flex-1">
                      <p className="text-sm text-white" style={{ fontWeight: 600 }}>
                        {['Prepare detailed roadmap for analytics dashboard', 'Post job descriptions for frontend roles', 'Update marketing plan with launch timeline', 'Analyze mobile app performance bottlenecks', 'Research third-party API alternatives'][i] || `Action item ${i + 1}`}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: DIM2 }}>
                        <span>Assigned to: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{name}</span></span>
                        <span>•</span>
                        <span>Due: Mar {20 + i}, 2026</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Score Card */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 sticky top-6">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>Meeting Score</h3>

            {/* Donut */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg className="h-32 w-32 -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke={scoreColor}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${progress} ${circumference}`}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 8px ${scoreColor})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span style={{ fontSize: '26px', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{meeting.score}</span>
                  <span style={{ fontSize: '12px', color: DIM2 }}>/100</span>
                </div>
              </div>
            </div>

            {/* Progress bars */}
            <div className="space-y-4">
              {[
                { label: 'Participation Balance', val: 85, color: '#34d399' },
                { label: 'Decision Rate', val: Math.min(Math.round((meeting.decisions / meeting.duration) * 10 * 100), 100), color: '#a78bfa' },
                { label: 'Action Item Rate', val: Math.min(Math.round((meeting.actions / meeting.duration) * 10 * 100), 100), color: '#22D3EE' },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: '12px', color: DIM2 }}>{label}</span>
                    <span style={{ fontSize: '12px', color, fontWeight: 700 }}>{val}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${val}%`, background: `linear-gradient(90deg,${color},${color}aa)`, boxShadow: `0 0 6px ${color}60` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="mt-5 pt-5 space-y-2" style={{ borderTop: BORDER }}>
              <h4 style={{ fontSize: '12px', color: DIM2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Insights</h4>
              {meeting.score >= 80 ? (
                <>
                  {['Well-balanced participation', 'Strong decision-making', 'Good meeting duration'].map((txt) => (
                    <div key={txt} className="flex items-start gap-2">
                      <TrendingUp className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#34d399' }} />
                      <span style={{ fontSize: '13px', color: '#34d399' }}>{txt}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '13px', color: '#f59e0b' }}>Participation could be more balanced</span>
                  </div>
                  {meeting.decisions < 2 && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', color: '#f59e0b' }}>Only {meeting.decisions} decision{meeting.decisions !== 1 ? 's' : ''} made</span>
                    </div>
                  )}
                  {meeting.duration > 60 && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', color: '#f59e0b' }}>Meeting exceeded planned duration</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}