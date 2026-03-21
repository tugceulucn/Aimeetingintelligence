import { Link } from 'react-router';
import { Brain, Lightbulb, AlertTriangle, Target, TrendingUp, Sparkles } from 'lucide-react';
import { meetings } from '../data/mockData';
import { useApp, useThemeColors } from '../context/AppContext';

export function Intelligence() {
  const { t } = useApp();
  const tc = useThemeColors();
  const recentMeetings = meetings.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-anim card-anim-1">
        <h1 className="page-title">{t('intelligence.title')}</h1>
        <p className="page-subtitle">{t('intelligence.subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 card-anim card-anim-2">
        {[
          { labelKey: 'intelligence.totalInsights', value: '127', color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', icon: Brain, iconBg: 'linear-gradient(135deg,#6D28D9,#a855f7)' },
          { labelKey: 'intelligence.risksDetected', value: '8', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', icon: AlertTriangle, iconBg: 'linear-gradient(135deg,#92400e,#f59e0b)' },
          { labelKey: 'intelligence.opportunities', value: '15', color: '#34d399', glow: 'rgba(52,211,153,0.3)', icon: Lightbulb, iconBg: 'linear-gradient(135deg,#065f46,#34d399)' },
        ].map(({ labelKey, value, color, glow, icon: Icon, iconBg }) => (
          <div
            key={labelKey}
            className="glass-card rounded-2xl p-6"
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${glow}`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = ''; }}
          >
            <div className="flex items-start justify-between mb-3">
              <p style={{ fontSize: '13px', color: tc.textDim, fontWeight: 500 }}>{t(labelKey)}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: iconBg, boxShadow: `0 0 14px ${glow}` }}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="glass-card rounded-2xl p-6 card-anim card-anim-3">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg,#6D28D9,#EC4899)', boxShadow: '0 0 20px rgba(109,40,217,0.5)', animation: 'glow-breathe 3s ease-in-out infinite' }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('intelligence.aiRecommendations')}</h2>
            <p style={{ fontSize: '12px', color: tc.textMuted }}>{t('intelligence.poweredBy')}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { icon: Target, color: '#a78bfa', titleKey: 'intelligence.rec1.title', subKey: 'intelligence.rec1.sub' },
            { icon: TrendingUp, color: '#34d399', titleKey: 'intelligence.rec2.title', subKey: 'intelligence.rec2.sub' },
            { icon: Lightbulb, color: '#f59e0b', titleKey: 'intelligence.rec3.title', subKey: 'intelligence.rec3.sub' },
          ].map(({ icon: Icon, color, titleKey, subKey }) => (
            <div
              key={titleKey}
              className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200"
              style={{ background: `${color}0d`, border: `1px solid ${color}25`, borderLeft: `3px solid ${color}` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}20`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}20` }}>
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <div>
                <p className="text-sm" style={{ fontWeight: 600, color: tc.textPrimary }}>{t(titleKey)}</p>
                <p className="mt-0.5 text-xs" style={{ color: tc.textMuted }}>{t(subKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Meeting Intelligence */}
      <div className="glass-card rounded-2xl overflow-hidden !p-0 card-anim card-anim-4">
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('intelligence.recentTitle')}</h2>
          <p style={{ fontSize: '12px', color: tc.textMuted, marginTop: 2 }}>{t('intelligence.recentSub')}</p>
        </div>
        <div>
          {recentMeetings.map((meeting, i) => (
            <div
              key={meeting.id}
              className="p-6 transition-all duration-200"
              style={{
                borderBottom: i < recentMeetings.length - 1 ? `1px solid ${tc.rowDivider}` : 'none',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = tc.rowHoverBg; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div className="flex items-start justify-between mb-3">
                <Link
                  to={`/meetings/${meeting.id}`}
                  className="text-sm transition-colors"
                  style={{ color: tc.textPrimary, fontWeight: 700 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tc.textPrimary; }}
                >
                  {meeting.name}
                </Link>
                <span style={{ fontSize: '12px', color: tc.textMuted }}>
                  {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <p className="text-sm mb-4" style={{ color: tc.textDim, lineHeight: 1.6 }}>{meeting.summary}</p>

              {/* Highlights */}
              <div className="mb-4">
                <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: '#a78bfa', fontWeight: 700 }}>{t('intelligence.keyHighlights')}</h4>
                <ul className="space-y-1.5">
                  {meeting.highlights.slice(0, 2).map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: tc.textDim }}>
                      <span style={{ color: '#a78bfa', marginTop: 2 }}>▸</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              {meeting.risks.length > 0 && (
                <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '3px solid #f59e0b' }}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#fbbf24', fontWeight: 600 }}>{t('intelligence.risksSection')}</p>
                      <ul className="mt-1 space-y-1">
                        {meeting.risks.map((r, j) => (
                          <li key={j} className="text-xs" style={{ color: 'rgba(251,191,36,0.7)' }}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs" style={{ color: tc.textMuted }}>
                <span style={{ color: '#a78bfa', fontWeight: 600 }}>{meeting.decisions} {t('intelligence.decisionsUnit')}</span>
                <span style={{ color: tc.borderMedium }}>•</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>{meeting.actions} {t('intelligence.actionsUnit')}</span>
                <span style={{ color: tc.borderMedium }}>•</span>
                <span>{meeting.participants} {t('intelligence.participantsUnit')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waste Detection */}
      <div className="glass-card rounded-2xl p-6 card-anim card-anim-5" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.04)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <AlertTriangle className="h-4 w-4" style={{ color: '#f59e0b' }} />
          </div>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('intelligence.wasteTitle')}</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              nameKey: 'intelligence.waste1.name',
              badgeKey: 'intelligence.waste1.badge',
              badgeColor: '#ef4444', badgeBg: 'rgba(239,68,68,0.1)',
              issues: [
                { bullet: '#ef4444', textKey: 'intelligence.waste1.issue1' },
                { bullet: '#ef4444', textKey: 'intelligence.waste1.issue2' },
                { bullet: '#ef4444', textKey: 'intelligence.waste1.issue3' },
              ],
            },
            {
              nameKey: 'intelligence.waste2.name',
              badgeKey: 'intelligence.waste2.badge',
              badgeColor: '#f59e0b', badgeBg: 'rgba(245,158,11,0.1)',
              issues: [
                { bullet: '#f59e0b', textKey: 'intelligence.waste2.issue1' },
                { bullet: '#f59e0b', textKey: 'intelligence.waste2.issue2' },
              ],
            },
          ].map(({ nameKey, badgeKey, badgeColor, badgeBg, issues }) => (
            <div
              key={nameKey}
              className="rounded-2xl p-5 transition-all duration-200"
              style={{ background: tc.containerBg, border: `1px solid ${tc.cardBorder}` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = tc.rowHoverBg; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = tc.containerBg; }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ fontWeight: 600, color: tc.textPrimary }}>{t(nameKey)}</p>
                <span className="text-xs rounded-lg px-2.5 py-1" style={{ background: badgeBg, color: badgeColor, fontWeight: 700, border: `1px solid ${badgeColor}30` }}>{t(badgeKey)}</span>
              </div>
              <ul className="space-y-1.5">
                {issues.map(({ bullet, textKey }) => (
                  <li key={textKey} className="flex items-start gap-2 text-sm" style={{ color: tc.textDim }}>
                    <span style={{ color: bullet, marginTop: 2 }}>•</span>
                    {t(textKey)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
