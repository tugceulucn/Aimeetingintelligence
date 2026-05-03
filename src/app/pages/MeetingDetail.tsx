import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft, Users, Clock, Calendar, Video, MessageSquare,
  Users as UsersIcon, Flag, CheckSquare, AlertTriangle, TrendingUp, Upload,
} from 'lucide-react';
import { MeetingScoreBadge } from '../components/MeetingScoreBadge';
import { useApp, useThemeColors } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { fetchMeetingDetail, type MeetingDetailData } from '../lib/meetingQueries';

const platformIcons = { zoom: Video, meet: MessageSquare, teams: UsersIcon, upload: Upload };
const platformColors: Record<string, string> = { zoom: '#2D8CFF', teams: '#5558AF', meet: '#34A853', upload: '#f59e0b' };

export function MeetingDetail() {
  const { id } = useParams();
  const { t, language } = useApp();
  const { session } = useAuth();
  const tc = useThemeColors();
  const [activeTab, setActiveTab] = useState<'transcript' | 'insights' | 'decisions' | 'actions'>('insights');
  const [meeting, setMeeting] = useState<MeetingDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const DIM = tc.textDim;
  const DIM2 = tc.textMuted;
  const WH = tc.textPrimary;
  const BORDER = `1px solid ${tc.borderSubtle}`;

  useEffect(() => {
    let active = true;

    async function loadMeeting() {
      if (!session || !id) {
        if (active) {
          setMeeting(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await fetchMeetingDetail(session, id);
        if (active) {
          setMeeting(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Toplanti detayi yuklenemedi.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMeeting();

    return () => {
      active = false;
    };
  }, [session, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm" style={{ color: tc.textDim }}>{t('detail.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
          <Link to="/meetings" style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>
            {t('detail.backToMeetings')}
          </Link>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm" style={{ color: tc.textDim }}>{t('detail.meetingNotFound')}</p>
          <Link to="/meetings" style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>
            {t('detail.backToMeetings')}
          </Link>
        </div>
      </div>
    );
  }

  const PlatformIcon = platformIcons[meeting.platform];
  const pColor = platformColors[meeting.platform] || '#6D28D9';

  const tabs = [
    { id: 'insights', label: t('detail.insights'), count: null },
    { id: 'transcript', label: t('detail.transcript'), count: meeting.transcript.length },
    { id: 'decisions', label: t('detail.decisions'), count: meeting.decisionsList.length },
    { id: 'actions', label: t('detail.actions'), count: meeting.actionsList.length },
  ] as const;

  const scoreColor = meeting.score >= 80 ? '#34d399' : meeting.score >= 70 ? '#a78bfa' : '#f87171';
  const circumference = 2 * Math.PI * 56;
  const progress = (meeting.score / 100) * circumference;

  return (
    <div className="space-y-6">
      <Link
        to="/meetings"
        className="inline-flex items-center gap-2 text-sm transition-colors card-anim card-anim-1"
        style={{ color: DIM, fontWeight: 500 }}
      >
        <ArrowLeft className="h-4 w-4" />
        {t('detail.backToMeetings')}
      </Link>

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
                { icon: Calendar, text: new Date(meeting.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { icon: Clock, text: `${meeting.duration} ${t('detail.minutes')}` },
                { icon: Users, text: `${meeting.participants} ${t('detail.participants')}` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: DIM2 }} />
                  <span className="text-sm" style={{ color: DIM }}>{text}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: pColor, boxShadow: `0 0 6px ${pColor}99` }} />
                <PlatformIcon className="h-4 w-4" style={{ color: DIM2 }} />
                <span className="text-sm capitalize" style={{ color: DIM }}>{meeting.platform}</span>
              </div>
            </div>

            <div className="mt-4 flex -space-x-2">
              {meeting.participantNames.length > 0 ? meeting.participantNames.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs text-white ring-2"
                  title={name}
                  style={{
                    background: `linear-gradient(135deg, ${['#6D28D9','#EC4899','#22D3EE','#7c3aed','#a855f7','#0891b2'][i % 6]}, ${['#EC4899','#22D3EE','#6D28D9','#a855f7','#6D28D9','#22D3EE'][i % 6]})`,
                    fontWeight: 700,
                    fontSize: 10,
                  }}
                >
                  {name.split(' ').map((n) => n[0]).join('')}
                </div>
              )) : (
                <span className="text-sm" style={{ color: DIM2 }}>{t('detail.noSpeakersDetected')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-3 card-anim card-anim-4">
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'insights' && (
            <>
              <div className="glass-card rounded-2xl p-6">
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 12 }}>{t('detail.aiSummary')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: DIM }}>{meeting.summary}</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 16 }}>{t('detail.keyHighlights')}</h3>
                {meeting.highlights.length > 0 ? (
                  <ul className="space-y-3">
                    {meeting.highlights.map((highlight, i) => (
                      <li key={`${highlight}-${i}`} className="flex items-start gap-3">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs text-white"
                          style={{ background: 'linear-gradient(135deg,#6D28D9,#EC4899)', fontWeight: 700, boxShadow: '0 0 8px rgba(109,40,217,0.4)' }}
                        >
                          {i + 1}
                        </div>
                        <span className="text-sm" style={{ color: DIM, lineHeight: 1.6 }}>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: DIM2 }}>{t('detail.noHighlightsAvailable')}</p>
                )}
              </div>
              {meeting.risks.length > 0 && (
                <div className="glass-card rounded-2xl p-6" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.05)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5" style={{ color: '#f59e0b' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fbbf24' }}>{t('detail.riskDetection')}</h3>
                  </div>
                  <ul className="space-y-2">
                    {meeting.risks.map((risk, i) => (
                      <li key={`${risk.text}-${i}`} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(251,191,36,0.8)' }}>
                        <span style={{ color: '#f59e0b', marginTop: 2 }}>•</span>
                        <span>{risk.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {activeTab === 'transcript' && (
            <div className="glass-card rounded-2xl p-6">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>{t('detail.meetingTranscript')}</h3>
              <div className="space-y-4">
                {meeting.transcript.length > 0 ? (
                  meeting.transcript.map((item, i) => (
                    <div key={`${item.time}-${i}`} className="flex gap-4 group">
                      <span className="text-xs font-mono w-12 shrink-0 pt-0.5" style={{ color: DIM2 }}>
                        {item.time}
                      </span>
                      <div className="flex-1 rounded-xl p-3 transition-all duration-200" style={{ background: 'rgba(255,255,255,0.02)', border: BORDER }}>
                        <span className="text-sm" style={{ color: '#a78bfa', fontWeight: 700 }}>{item.speaker}:</span>
                        <span className="ml-2 text-sm" style={{ color: DIM }}>{item.text}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-12 text-sm" style={{ color: DIM2 }}>
                    {t('detail.transcriptUnavailable')}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'decisions' && (
            <div className="glass-card rounded-2xl p-6">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>{t('detail.decisionsMade')}</h3>
              <div className="space-y-3">
                {meeting.decisionsList.length > 0 ? meeting.decisionsList.map((decision, i) => (
                  <div key={`${decision.decision}-${i}`} className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200"
                    style={{ background: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.2)', borderLeft: '3px solid #6D28D9' }}>
                    <Flag className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <div>
                      <p className="text-sm" style={{ color: WH, fontWeight: 600 }}>{decision.decision}</p>
                      <p className="text-xs mt-1" style={{ color: DIM2 }}>
                        {t('detail.confidence')}: {Math.round(decision.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm" style={{ color: DIM2 }}>{t('detail.noDecisionsRecorded')}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="glass-card rounded-2xl p-6">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>{t('detail.actionItems')}</h3>
              <div className="space-y-3">
                {meeting.actionsList.length > 0 ? meeting.actionsList.map((action, i) => (
                  <div key={`${action.task}-${i}`} className="flex items-start gap-4 rounded-xl p-4 transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.03)', border: BORDER }}>
                    <div className="h-5 w-5 mt-0.5 rounded shrink-0"
                      style={{ border: '2px solid rgba(109,40,217,0.4)', background: 'transparent' }} />
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: WH, fontWeight: 600 }}>{action.task}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: DIM2 }}>
                        <span>{t('detail.assignedTo')} <span style={{ color: '#a78bfa', fontWeight: 600 }}>{action.owner || t('detail.unassigned')}</span></span>
                        {action.dueDate && (
                          <>
                            <span>•</span>
                            <span>{t('detail.due')} {action.dueDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm" style={{ color: DIM2 }}>{t('detail.noActionsRecorded')}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 sticky top-6">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: WH, marginBottom: 20 }}>{t('detail.meetingScore')}</h3>

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

            <div className="space-y-4">
              {[
                { label: t('detail.participationBalance'), val: meeting.participationScore, color: '#34d399' },
                { label: t('detail.decisionRate'), val: meeting.duration > 0 ? Math.min(Math.round((meeting.decisions / meeting.duration) * 10 * 100), 100) : 0, color: '#a78bfa' },
                { label: t('detail.actionItemRate'), val: meeting.duration > 0 ? Math.min(Math.round((meeting.actions / meeting.duration) * 10 * 100), 100) : 0, color: '#22D3EE' },
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

            <div className="mt-5 pt-5 space-y-2" style={{ borderTop: BORDER }}>
              <h4 style={{ fontSize: '12px', color: DIM2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{t('detail.insights')}</h4>
              {meeting.score >= 80 ? (
                ['Well-balanced participation', 'Strong decision-making', 'Good meeting duration'].map((txt) => (
                  <div key={txt} className="flex items-start gap-2">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#34d399' }} />
                    <span style={{ fontSize: '13px', color: '#34d399' }}>{txt}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '13px', color: '#f59e0b' }}>{t('detail.participationWarning')}</span>
                  </div>
                  {meeting.decisions < 2 && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', color: '#f59e0b' }}>
                        {t('detail.onlyDecisionsMade').replace('{count}', String(meeting.decisions))}
                      </span>
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
