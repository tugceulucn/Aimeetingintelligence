import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import {
  TrendingUp, Calendar, Flag, CheckSquare, ArrowUpRight,
  AlertTriangle, Sparkles, Brain, Zap, Clock, Activity,
} from 'lucide-react';
import { meetings, weeklyProductivity, meetingWaste, teamMeetingHours } from '../data/mockData';
import { useApp } from '../context/AppContext';

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const step = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(interval); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ─── Glassmorphism card ─── */
function GlassCard({
  children, className = '', style = {}, glowColor = 'rgba(109,40,217,0.15)', animClass = ''
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
  animClass?: string;
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 card-anim ${animClass} ${className}`}
      style={{ ...style }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${glowColor}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {children}
    </div>
  );
}

/* ─── Metric card ─── */
function MetricCard({
  title, value, change, icon: Icon, accent, animClass,
}: {
  title: string;
  value: number | string;
  change?: string;
  icon: React.ElementType;
  accent: { bg: string; glow: string; text: string };
  animClass: string;
}) {
  const numVal = typeof value === 'number' ? value : parseInt(String(value));
  const { count, ref } = useCountUp(numVal);
  const { theme } = useApp();
  const isLight = theme === 'light';

  return (
    <div
      ref={ref}
      className={`glass-card rounded-2xl p-6 card-anim ${animClass}`}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${accent.glow}`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm" style={{ color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{title}</p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: accent.bg, boxShadow: `0 0 16px ${accent.glow}` }}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p
          className="gradient-text"
          style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {count}
        </p>
        {change && (
          <div
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
            style={{
              background: 'rgba(34,211,238,0.1)',
              color: '#22D3EE',
              fontWeight: 600,
              border: '1px solid rgba(34,211,238,0.2)',
            }}
          >
            <TrendingUp className="h-3 w-3" />
            {change}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Custom tooltip ─── */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3"
        style={{
          background: 'rgba(20,15,35,0.95)',
          border: '1px solid rgba(109,40,217,0.4)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(109,40,217,0.3)',
        }}
      >
        <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: '#c4b5fd' }}>
            {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/* ─── Score badge ─── */
function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? 'score-badge-high' : score >= 70 ? 'score-badge-mid' : 'score-badge-low';
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs text-white ${cls}`}
      style={{ fontWeight: 700, letterSpacing: '0.02em' }}
    >
      {score}
    </span>
  );
}

/* ─── Platform dot ─── */
function PlatformDot({ platform }: { platform: string }) {
  const colors: Record<string, string> = { zoom: '#2D8CFF', teams: '#5558AF', meet: '#34A853' };
  return (
    <span
      className="inline-block h-2 w-2 rounded-full mr-2"
      style={{ background: colors[platform] || '#6D28D9', boxShadow: `0 0 6px ${colors[platform]}99` }}
    />
  );
}

/* ─── Main Dashboard ─── */
export function Dashboard() {
  const { t, theme } = useApp();
  const isLight = theme === 'light';

  const textColor = isLight ? '#1a1a2e' : 'rgba(255,255,255,0.85)';
  const textMuted = isLight ? '#6b7280' : 'rgba(255,255,255,0.4)';
  const subText   = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.45)';
  const rowBorder = isLight ? '1px solid rgba(109,40,217,0.07)' : '1px solid rgba(255,255,255,0.04)';
  const cardInnerBg = isLight ? 'rgba(109,40,217,0.03)' : 'rgba(255,255,255,0.03)';
  const cardInnerBorder = isLight ? 'rgba(109,40,217,0.08)' : 'rgba(255,255,255,0.06)';

  const thisWeekMeetings = meetings.filter((m) => {
    const date = new Date(m.date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  }).length;

  const totalDecisions = meetings.reduce((s, m) => s + m.decisions, 0);
  const totalActions = meetings.reduce((s, m) => s + m.actions, 0);

  const gradientBarData = teamMeetingHours.map((d, i) => ({
    ...d,
    fill: ['#6D28D9', '#EC4899', '#22D3EE', '#7c3aed', '#a855f7'][i % 5],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-anim card-anim-1">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', color: textColor }}>
          {t('dashboard.greeting')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: textMuted }}>
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('dashboard.productivityScore')}
          value={76}
          change="+5 this week"
          icon={TrendingUp}
          accent={{ bg: 'linear-gradient(135deg, #6D28D9, #EC4899)', glow: 'rgba(109,40,217,0.5)', text: '#c4b5fd' }}
          animClass="card-anim-1"
        />
        <MetricCard
          title={t('dashboard.meetingsWeek')}
          value={thisWeekMeetings}
          change="+3 vs last"
          icon={Calendar}
          accent={{ bg: 'linear-gradient(135deg, #0891b2, #22D3EE)', glow: 'rgba(34,211,238,0.4)', text: '#67e8f9' }}
          animClass="card-anim-2"
        />
        <MetricCard
          title={t('dashboard.decisionsExtracted')}
          value={totalDecisions}
          icon={Flag}
          accent={{ bg: 'linear-gradient(135deg, #7c3aed, #a855f7)', glow: 'rgba(168,85,247,0.4)', text: '#d8b4fe' }}
          animClass="card-anim-3"
        />
        <MetricCard
          title={t('dashboard.actionItems')}
          value={totalActions}
          icon={CheckSquare}
          accent={{ bg: 'linear-gradient(135deg, #be185d, #EC4899)', glow: 'rgba(236,72,153,0.4)', text: '#f9a8d4' }}
          animClass="card-anim-4"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Productivity Trend */}
        <GlassCard animClass="card-anim-4" glowColor="rgba(109,40,217,0.25)">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor }}>
                {t('dashboard.productivityTrend')}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                {t('dashboard.productivityTrendSub')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', color: '#22D3EE', fontWeight: 600 }}>
              <Activity className="h-3 w-3" />
              {t('dashboard.live')}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyProductivity}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D28D9" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#6D28D9" />
                  <stop offset="0.5" stopColor="#EC4899" />
                  <stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: isLight ? '#9ca3af' : 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: isLight ? '#9ca3af' : 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} domain={[60, 85]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke="url(#lineGrad)" strokeWidth={3} fill="url(#prodGrad)"
                dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#EC4899' }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Time Distribution */}
        <GlassCard animClass="card-anim-5" glowColor="rgba(236,72,153,0.2)">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor }}>
                {t('dashboard.timeDistribution')}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                {t('dashboard.timeDistributionSub')}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gradientBarData} barSize={32}>
              <defs>
                {gradientBarData.map((d, i) => (
                  <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={d.fill} stopOpacity={1} />
                    <stop offset="100%" stopColor={d.fill} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="team" tick={{ fontSize: 9, fill: isLight ? '#9ca3af' : 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: isLight ? '#9ca3af' : 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {gradientBarData.map((_, i) => <Cell key={i} fill={`url(#barGrad${i})`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Waste + AI Insights */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Waste Donut */}
        <GlassCard animClass="card-anim-5" glowColor="rgba(34,211,238,0.2)">
          <h3 className="mb-1" style={{ fontSize: '15px', fontWeight: 700, color: textColor }}>
            {t('dashboard.effectiveness')}
          </h3>
          <p className="text-xs mb-4" style={{ color: textMuted }}>{t('dashboard.wasteDetection')}</p>
          <div className="flex flex-col items-center">
            <div className="relative">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={meetingWaste} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                    {meetingWaste.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span style={{ fontSize: '22px', fontWeight: 800, color: textColor }}>52%</span>
                <span className="text-xs" style={{ color: textMuted }}>{t('dashboard.productive')}</span>
              </div>
            </div>
            <div className="mt-4 w-full space-y-2">
              {meetingWaste.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}99` }} />
                    <span className="text-xs" style={{ color: subText }}>{item.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: textColor, fontWeight: 700 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard animClass="card-anim-6" className="lg:col-span-2" glowColor="rgba(109,40,217,0.3)">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 20px rgba(109,40,217,0.5)', animation: 'glow-breathe 3s ease-in-out infinite' }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor }}>{t('dashboard.aiInsights')}</h3>
              <p className="text-xs" style={{ color: textMuted }}>{t('dashboard.aiInsightsSub')}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
              style={{ background: 'rgba(109,40,217,0.15)', border: '1px solid rgba(109,40,217,0.3)', color: '#a78bfa', fontWeight: 600 }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#a78bfa', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
              {t('dashboard.processing')}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: ArrowUpRight, color: '#22D3EE', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.2)', borderLeft: '#22D3EE',
                title: t('insight.1.title'), sub: t('insight.1.sub') },
              { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', borderLeft: '#f59e0b',
                title: t('insight.2.title'), sub: t('insight.2.sub') },
              { icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', borderLeft: '#34d399',
                title: t('insight.3.title'), sub: t('insight.3.sub') },
            ].map(({ icon: Icon, color, bg, border, borderLeft, title, sub }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200"
                style={{ background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${borderLeft}` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${border}`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}20` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: textColor, fontWeight: 600 }}>{title}</p>
                  <p className="mt-0.5 text-xs" style={{ color: textMuted }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Meetings Table */}
      <GlassCard animClass="card-anim-7" glowColor="rgba(109,40,217,0.2)" className="!p-0">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid ${cardInnerBorder}` }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor }}>{t('dashboard.recentMeetings')}</h3>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>{meetings.length} {t('dashboard.meetingsAnalyzed')}</p>
          </div>
          <Link to="/meetings" className="text-sm transition-colors"
            style={{ color: '#a78bfa', fontWeight: 600 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#c4b5fd'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}>
            {t('dashboard.viewAll')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: rowBorder }}>
                {[t('table.meeting'), t('table.platform'), t('table.participants'), t('table.duration'), t('table.score'), t('table.decisions'), t('table.actions')].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs uppercase tracking-wider"
                    style={{ color: isLight ? '#9ca3af' : 'rgba(255,255,255,0.3)', fontWeight: 600, background: cardInnerBg }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meetings.slice(0, 5).map((meeting, i) => (
                <tr key={meeting.id} className="meeting-row cursor-pointer"
                  style={{ borderBottom: i < 4 ? rowBorder : 'none' }}>
                  <td className="px-6 py-4">
                    <Link to={`/meetings/${meeting.id}`} className="text-sm transition-colors"
                      style={{ color: textColor, fontWeight: 600 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}>
                      {meeting.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs flex items-center" style={{ color: subText }}>
                      <PlatformDot platform={meeting.platform} />
                      {meeting.platform.charAt(0).toUpperCase() + meeting.platform.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: subText }}>{meeting.participants}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" style={{ color: isLight ? '#d1d5db' : 'rgba(255,255,255,0.3)' }} />
                      <span className="text-sm" style={{ color: subText }}>{meeting.duration}m</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><ScoreBadge score={meeting.score} /></td>
                  <td className="px-6 py-4 text-sm" style={{ color: textColor, fontWeight: 600 }}>{meeting.decisions}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: textColor, fontWeight: 600 }}>{meeting.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Alerts + Upcoming */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Alerts */}
        <GlassCard animClass="card-anim-7" glowColor="rgba(245,158,11,0.2)">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <AlertTriangle className="h-3.5 w-3.5" style={{ color: '#f59e0b' }} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor }}>{t('alerts.title')}</h3>
          </div>
          <div className="space-y-3">
            {[
              { msg: t('alerts.1.msg'), hint: t('alerts.1.hint'), color: '#f59e0b' },
              { msg: t('alerts.2.msg'), hint: t('alerts.2.hint'), color: '#EC4899' },
              { msg: t('alerts.3.msg'), hint: t('alerts.3.hint'), color: '#a78bfa' },
            ].map(({ msg, hint, color }) => (
              <div key={msg} className="flex items-start gap-3 rounded-xl p-3.5 transition-all duration-200"
                style={{ background: cardInnerBg, border: `1px solid ${cardInnerBorder}`, borderLeft: `3px solid ${color}` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isLight ? 'rgba(109,40,217,0.05)' : 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}20`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = cardInnerBg; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <div>
                  <p className="text-sm" style={{ color: textColor, fontWeight: 500 }}>{msg}</p>
                  <p className="text-xs mt-0.5" style={{ color: textMuted }}>{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming */}
        <GlassCard animClass="card-anim-7" glowColor="rgba(34,211,238,0.2)">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
              <Calendar className="h-3.5 w-3.5" style={{ color: '#22D3EE' }} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: textColor }}>{t('upcoming.title')}</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Product Sync', time: 'Today at 3:00 PM', badge: t('upcoming.in2h'), badgeColor: '#22D3EE', badgeBg: 'rgba(34,211,238,0.1)' },
              { name: 'Sales Demo', time: 'Tomorrow at 10:30 AM', badge: t('upcoming.tomorrow'), badgeColor: subText, badgeBg: cardInnerBg },
              { name: 'Design Review', time: 'Fri at 2:00 PM', badge: t('upcoming.fri'), badgeColor: subText, badgeBg: cardInnerBg },
            ].map(({ name, time, badge, badgeColor, badgeBg }) => (
              <div key={name} className="flex items-center justify-between rounded-xl p-3.5 transition-all duration-200"
                style={{ background: cardInnerBg, border: `1px solid ${cardInnerBorder}` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isLight ? 'rgba(109,40,217,0.05)' : 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = cardInnerBg; }}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(109,40,217,0.15)', border: '1px solid rgba(109,40,217,0.2)' }}>
                    <Zap className="h-3.5 w-3.5" style={{ color: '#a78bfa' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: textColor, fontWeight: 600 }}>{name}</p>
                    <p className="text-xs mt-0.5" style={{ color: textMuted }}>{time}</p>
                  </div>
                </div>
                <span className="text-xs rounded-full px-2.5 py-1"
                  style={{ color: badgeColor, background: badgeBg, fontWeight: 600, border: `1px solid ${badgeColor}30` }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}