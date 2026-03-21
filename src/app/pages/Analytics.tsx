import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Area, AreaChart, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, Target, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { weeklyProductivity } from '../data/mockData';
import { useApp, useThemeColors } from '../context/AppContext';

const teamData = [
  { team: 'Engineering', meetings: 14, decisions: 38, avgDuration: 52, productivity: 78 },
  { team: 'Product', meetings: 9, decisions: 45, avgDuration: 48, productivity: 82 },
  { team: 'Sales', meetings: 18, decisions: 28, avgDuration: 38, productivity: 71 },
  { team: 'Marketing', meetings: 7, decisions: 42, avgDuration: 55, productivity: 74 },
  { team: 'CS', meetings: 5, decisions: 35, avgDuration: 40, productivity: 79 },
];

const decisionRateData = [
  { team: 'Product', rate: 45 },
  { team: 'Marketing', rate: 42 },
  { team: 'Engineering', rate: 38 },
  { team: 'CS', rate: 35 },
  { team: 'Sales', rate: 28 },
];

const meetingWasteByTeam = [
  { team: 'Product', productive: 75, neutral: 20, wasteful: 5 },
  { team: 'Engineering', productive: 65, neutral: 25, wasteful: 10 },
  { team: 'Marketing', productive: 70, neutral: 22, wasteful: 8 },
  { team: 'Sales', productive: 55, neutral: 30, wasteful: 15 },
];

const TEAM_COLORS = ['#6D28D9', '#EC4899', '#22D3EE', '#f59e0b', '#34d399'];

function DarkTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(18,12,30,0.97)',
        border: '1px solid rgba(109,40,217,0.4)',
        borderRadius: 12,
        padding: '10px 14px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(109,40,217,0.3)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: '#c4b5fd', fontWeight: 700, fontSize: 13 }}>{p.value}</p>
        ))}
      </div>
    );
  }
  return null;
}

export function Analytics() {
  const { t } = useApp();
  const tc = useThemeColors();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-anim card-anim-1">
        <h1 className="page-title">{t('analytics.title')}</h1>
        <p className="page-subtitle">{t('analytics.subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4 card-anim card-anim-2">
        {[
          { labelKey: 'analytics.avgScore', value: '77', deltaKey: 'analytics.deltaFromLastMonth', icon: Target, positive: true, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
          { labelKey: 'analytics.meetingsWeek', value: '53', deltaKey: 'analytics.deltaFromLastWeek', icon: Users, positive: true, color: '#22D3EE', glow: 'rgba(34,211,238,0.3)' },
          { labelKey: 'analytics.avgDuration', value: '47m', deltaKey: 'analytics.deltaMinImprovement', icon: Clock, positive: true, color: '#34d399', glow: 'rgba(52,211,153,0.3)' },
          { labelKey: 'analytics.waste', value: '12%', deltaKey: 'analytics.deltaWaste', icon: AlertCircle, positive: true, color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
        ].map(({ labelKey, value, deltaKey, icon: Icon, positive, color, glow }) => (
          <div
            key={labelKey}
            className="glass-card rounded-2xl p-6"
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${glow}`;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '';
              (e.currentTarget as HTMLElement).style.transform = '';
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <p style={{ fontSize: '12px', color: tc.textDim, fontWeight: 500 }}>{t(labelKey)}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {positive ? <TrendingDown className="h-3 w-3" style={{ color: '#34d399' }} /> : <TrendingUp className="h-3 w-3" style={{ color: '#f87171' }} />}
              <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>{t(deltaKey)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Meetings per week by team */}
        <div className="glass-card rounded-2xl p-6 card-anim card-anim-3">
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary, marginBottom: 4 }}>{t('analytics.meetingsPerWeek')}</h3>
          <p style={{ fontSize: '12px', color: tc.textMuted, marginBottom: '20px' }}>{t('analytics.volumeByTeam')}</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={teamData} barSize={28}>
              <defs>
                {TEAM_COLORS.map((c, i) => (
                  <linearGradient key={i} id={`abar${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={1} />
                    <stop offset="100%" stopColor={c} stopOpacity={0.35} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="team" tick={{ fontSize: 10, fill: tc.tableHeader }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: tc.tableHeader }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="meetings" radius={[6, 6, 0, 0]}>
                {teamData.map((_, i) => <Cell key={i} fill={`url(#abar${i})`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Decision Rate */}
        <div className="glass-card rounded-2xl p-6 card-anim card-anim-4">
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary, marginBottom: 4 }}>{t('analytics.decisionRateTitle')}</h3>
          <p style={{ fontSize: '12px', color: tc.textMuted, marginBottom: '20px' }}>{t('analytics.decisionRateSub')}</p>
          <div className="space-y-4">
            {decisionRateData.map(({ team, rate }, i) => (
              <div key={team}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: '13px', color: tc.textSecondary, fontWeight: 500 }}>{team}</span>
                  <span style={{ fontSize: '13px', color: TEAM_COLORS[i], fontWeight: 700 }}>{rate}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: tc.filterBg }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${rate}%`,
                      background: `linear-gradient(90deg, ${TEAM_COLORS[i]}, ${TEAM_COLORS[(i + 1) % TEAM_COLORS.length]})`,
                      boxShadow: `0 0 8px ${TEAM_COLORS[i]}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productivity Trend */}
      <div className="glass-card rounded-2xl p-6 card-anim card-anim-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('analytics.trend')}</h3>
            <p style={{ fontSize: '12px', color: tc.textMuted, marginTop: 2 }}>{t('analytics.trendSub')}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
            style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', color: '#22D3EE', fontWeight: 600 }}>
            <Activity className="h-3 w-3" />
            {t('analytics.live')}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyProductivity}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6D28D9" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="analyticsLine" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#6D28D9" />
                <stop offset="0.5" stopColor="#EC4899" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: tc.tableHeader }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: tc.tableHeader }} axisLine={false} tickLine={false} domain={[60, 85]} />
            <Tooltip content={<DarkTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="url(#analyticsLine)"
              strokeWidth={3}
              fill="url(#analyticsGrad)"
              dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#EC4899' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Team Performance Cards */}
      <div className="glass-card rounded-2xl p-6 card-anim card-anim-6">
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary, marginBottom: 24 }}>{t('analytics.performance')}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamData.map((team, i) => {
            const scoreColor = team.productivity >= 80 ? '#34d399' : team.productivity >= 70 ? '#a78bfa' : '#f87171';
            const scoreGlow = team.productivity >= 80 ? 'rgba(52,211,153,0.3)' : team.productivity >= 70 ? 'rgba(167,139,250,0.3)' : 'rgba(248,113,113,0.3)';
            return (
              <div
                key={team.team}
                className="rounded-2xl p-5 transition-all duration-200"
                style={{
                  background: tc.containerBg,
                  border: `1px solid ${tc.cardBorder}`,
                  borderLeft: `3px solid ${TEAM_COLORS[i]}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = tc.rowHoverBg;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${TEAM_COLORS[i]}20`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = tc.containerBg;
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                  (e.currentTarget as HTMLElement).style.transform = '';
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 style={{ fontWeight: 700, fontSize: '14px', color: tc.textPrimary }}>{team.team}</h4>
                  <span
                    className="rounded-lg px-2.5 py-1 text-xs"
                    style={{ background: `${scoreColor}18`, color: scoreColor, fontWeight: 700, border: `1px solid ${scoreColor}30`, boxShadow: `0 0 8px ${scoreGlow}` }}
                  >
                    {team.productivity}%
                  </span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { labelKey: 'analytics.meetingsWkLabel', val: team.meetings },
                    { labelKey: 'analytics.decisionRateLabel', val: `${team.decisions}%` },
                    { labelKey: 'analytics.avgDurationLabel', val: `${team.avgDuration}m` },
                  ].map(({ labelKey, val }) => (
                    <div key={labelKey} className="flex justify-between text-sm">
                      <span style={{ color: tc.textMuted }}>{t(labelKey)}</span>
                      <span style={{ color: tc.textSecondary, fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: tc.filterBg }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${team.productivity}%`, background: `linear-gradient(90deg, ${TEAM_COLORS[i]}, ${scoreColor})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meeting Waste */}
      <div className="glass-card rounded-2xl p-6 card-anim card-anim-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('analytics.wasteTitle')}</h3>
            <p style={{ fontSize: '12px', color: tc.textMuted, marginTop: 2 }}>{t('analytics.wasteSub')}</p>
          </div>
          <div className="rounded-2xl px-4 py-2 text-center"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>23%</p>
            <p style={{ fontSize: '10px', color: 'rgba(245,158,11,0.7)' }}>{t('analytics.couldBeAsync')}</p>
          </div>
        </div>
        <div className="space-y-5">
          {meetingWasteByTeam.map(({ team, productive, neutral, wasteful }) => (
            <div key={team}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '13px', color: tc.textSecondary, fontWeight: 600 }}>{team}</span>
                <span style={{ fontSize: '11px', color: tc.textMuted }}>
                  {productive}% {t('analytics.productive').toLowerCase()} · {wasteful}% {t('analytics.wasteful').toLowerCase()}
                </span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div style={{ width: `${productive}%`, background: 'linear-gradient(90deg, #059669, #34d399)', borderRadius: '4px 0 0 4px', boxShadow: '0 0 8px rgba(52,211,153,0.4)' }} />
                <div style={{ width: `${neutral}%`, background: 'linear-gradient(90deg, #92400e, #f59e0b)' }} />
                <div style={{ width: `${wasteful}%`, background: 'linear-gradient(90deg, #b91c1c, #ef4444)', borderRadius: '0 4px 4px 0', boxShadow: '0 0 6px rgba(239,68,68,0.4)' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-6">
          {[
            { labelKey: 'analytics.productive', color: '#34d399' },
            { labelKey: 'analytics.neutral', color: '#f59e0b' },
            { labelKey: 'analytics.wasteful', color: '#ef4444' },
          ].map(({ labelKey, color }) => (
            <div key={labelKey} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
              <span style={{ fontSize: '12px', color: tc.textDim }}>{t(labelKey)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass-card rounded-2xl p-6 card-anim card-anim-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 20px rgba(109,40,217,0.5)', animation: 'glow-breathe 3s ease-in-out infinite' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('analytics.recommendations')}</h3>
            <p style={{ fontSize: '12px', color: tc.textMuted }}>{t('analytics.recommendationsSub')}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { icon: AlertCircle, color: '#f59e0b', titleKey: 'analytics.rec1.title', subKey: 'analytics.rec1.sub' },
            { icon: AlertCircle, color: '#EC4899', titleKey: 'analytics.rec2.title', subKey: 'analytics.rec2.sub' },
            { icon: TrendingUp, color: '#34d399', titleKey: 'analytics.rec3.title', subKey: 'analytics.rec3.sub' },
          ].map(({ icon: Icon, color, titleKey, subKey }) => (
            <div
              key={titleKey}
              className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200"
              style={{ background: `${color}0d`, border: `1px solid ${color}25`, borderLeft: `3px solid ${color}` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}20` }}>
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <div>
                <p className="text-sm" style={{ fontWeight: 600, color: tc.textPrimary }}>{t(titleKey)}</p>
                <p className="mt-0.5 text-xs" style={{ color: tc.textDim }}>{t(subKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
