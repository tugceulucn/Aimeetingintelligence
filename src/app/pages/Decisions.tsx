import { useState } from 'react';
import { Link } from 'react-router';
import { Flag, Calendar, User, ArrowRight } from 'lucide-react';
import { decisions } from '../data/mockData';
import { useApp, useThemeColors } from '../context/AppContext';

const colConfig = {
  new:          { labelKey: 'decisions.newDecisions', color: '#22D3EE', glow: 'rgba(34,211,238,0.3)', gradient: 'linear-gradient(135deg,#0891b2,#22D3EE)' },
  'in-progress':{ labelKey: 'decisions.inProgress',  color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', gradient: 'linear-gradient(135deg,#6D28D9,#a855f7)' },
  completed:    { labelKey: 'decisions.completed',   color: '#34d399', glow: 'rgba(52,211,153,0.3)',  gradient: 'linear-gradient(135deg,#059669,#34d399)' },
} as const;

function DecisionCard({ decision, t, tc }: {
  decision: typeof decisions[0];
  t: (key: string) => string;
  tc: ReturnType<typeof useThemeColors>;
}) {
  const cfg = colConfig[decision.status];
  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200"
      style={{
        background: tc.containerBg,
        border: `1px solid ${cfg.color}30`,
        borderLeft: `3px solid ${cfg.color}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = tc.rowHoverBg;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${cfg.glow}`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = tc.containerBg;
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${cfg.color}18`, boxShadow: `0 0 8px ${cfg.glow}` }}
        >
          <Flag className="h-3.5 w-3.5" style={{ color: cfg.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ fontWeight: 600, lineHeight: 1.4, color: tc.textPrimary }}>{decision.title}</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" style={{ color: tc.iconMuted }} />
              <span className="text-xs" style={{ color: tc.textDim }}>{decision.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" style={{ color: tc.iconMuted }} />
              <span className="text-xs" style={{ color: tc.textDim }}>
                {t('decisions.due')} {new Date(decision.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <Link
              to={`/meetings/${decision.meetingId}`}
              className="group flex items-center gap-1 transition-colors"
              style={{ color: cfg.color }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <span className="text-xs" style={{ fontWeight: 500 }}>{t('decisions.from')} {decision.meetingName}</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Decisions() {
  const { t } = useApp();
  const tc = useThemeColors();
  const [filter, setFilter] = useState<'all' | 'new' | 'in-progress' | 'completed'>('all');

  const statusCounts = {
    new: decisions.filter((d) => d.status === 'new').length,
    'in-progress': decisions.filter((d) => d.status === 'in-progress').length,
    completed: decisions.filter((d) => d.status === 'completed').length,
  };

  const filterTabs: { key: 'all' | 'new' | 'in-progress' | 'completed'; labelKey: string }[] = [
    { key: 'all', labelKey: 'decisions.all' },
    { key: 'new', labelKey: 'decisions.new' },
    { key: 'in-progress', labelKey: 'decisions.inProgress' },
    { key: 'completed', labelKey: 'decisions.completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-anim card-anim-1">
        <h1 className="page-title">{t('decisions.title')}</h1>
        <p className="page-subtitle">{t('decisions.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 card-anim card-anim-2">
        {[
          { labelKey: 'decisions.total', value: decisions.length, color: '#a78bfa' },
          { labelKey: 'decisions.new', value: statusCounts.new, color: '#22D3EE' },
          { labelKey: 'decisions.inProgress', value: statusCounts['in-progress'], color: '#a78bfa' },
          { labelKey: 'decisions.completed', value: statusCounts.completed, color: '#34d399' },
        ].map(({ labelKey, value, color }) => (
          <div key={labelKey} className="glass-card rounded-2xl p-5"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}30`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
            <p style={{ fontSize: '12px', color: tc.textDim, fontWeight: 500 }}>{t(labelKey)}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: 6 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl p-1 w-fit card-anim card-anim-3"
        style={{ background: tc.filterBg, border: `1px solid ${tc.filterBorder}` }}>
        {filterTabs.map(({ key, labelKey }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="rounded-lg px-4 py-1.5 text-xs transition-all"
            style={{
              background: filter === key ? 'linear-gradient(135deg, #6D28D9, #EC4899)' : 'transparent',
              color: filter === key ? '#fff' : tc.textDim,
              fontWeight: filter === key ? 700 : 500,
              boxShadow: filter === key ? '0 0 12px rgba(109,40,217,0.4)' : 'none',
            }}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid gap-4 lg:grid-cols-3 card-anim card-anim-4">
        {(['new', 'in-progress', 'completed'] as const).map((status) => {
          const cfg = colConfig[status];
          const items = decisions.filter((d) => filter === 'all' ? d.status === status : d.status === status && filter === status);
          const count = decisions.filter((d) => d.status === status).length;
          return (
            <div key={status}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
                  <h3 className="text-xs uppercase tracking-wider" style={{ color: tc.textSecondary, fontWeight: 700 }}>
                    {t(cfg.labelKey)}
                  </h3>
                </div>
                <span
                  className="rounded-lg px-2.5 py-0.5 text-xs"
                  style={{ background: `${cfg.color}18`, color: cfg.color, fontWeight: 700, border: `1px solid ${cfg.color}30` }}
                >
                  {count}
                </span>
              </div>
              <div
                className="min-h-32 rounded-2xl p-3 space-y-3"
                style={{ background: tc.containerBg, border: `1px dashed ${tc.borderSubtle}` }}
              >
                {(filter === 'all' ? decisions.filter((d) => d.status === status) : items).map((d) => (
                  <DecisionCard key={d.id} decision={d} t={t} tc={tc} />
                ))}
                {(filter !== 'all' && filter !== status) && (
                  <div className="py-8 text-center">
                    <p style={{ color: tc.textMuted, fontSize: '12px' }}>{t('decisions.selectAll')}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
