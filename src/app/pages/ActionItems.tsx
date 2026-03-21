import { useState } from 'react';
import { Link } from 'react-router';
import { CheckSquare, Search, ArrowRight, Clock } from 'lucide-react';
import { actionItems } from '../data/mockData';
import { useApp, useThemeColors } from '../context/AppContext';

const statusConfig = {
  pending:      { labelKey: 'actions.pendingLabel',    color: '#fb923c', glow: 'rgba(251,146,60,0.5)',  bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.3)' },
  'in-progress':{ labelKey: 'actions.inProgressLabel', color: '#a78bfa', glow: 'rgba(167,139,250,0.5)', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  completed:    { labelKey: 'actions.completedLabel',  color: '#34d399', glow: 'rgba(52,211,153,0.5)',  bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)' },
};

function StatusBadge({ status, t }: { status: keyof typeof statusConfig; t: (key: string) => string }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
      {t(cfg.labelKey)}
    </span>
  );
}

export function ActionItems() {
  const { t } = useApp();
  const tc = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const filteredItems = actionItems.filter((item) => {
    const matchesSearch =
      item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: actionItems.length,
    pending: actionItems.filter((a) => a.status === 'pending').length,
    'in-progress': actionItems.filter((a) => a.status === 'in-progress').length,
    completed: actionItems.filter((a) => a.status === 'completed').length,
  };

  const filterTabs: { key: 'all' | 'pending' | 'in-progress' | 'completed'; labelKey: string }[] = [
    { key: 'all', labelKey: 'actions.all' },
    { key: 'pending', labelKey: 'actions.pending' },
    { key: 'in-progress', labelKey: 'actions.inProgress' },
    { key: 'completed', labelKey: 'actions.completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-anim card-anim-1">
        <h1 className="page-title">{t('actions.title')}</h1>
        <p className="page-subtitle">{t('actions.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 card-anim card-anim-2">
        {[
          { labelKey: 'actions.total', value: counts.total, color: '#a78bfa' },
          { labelKey: 'actions.pending', value: counts.pending, color: '#fb923c' },
          { labelKey: 'actions.inProgress', value: counts['in-progress'], color: '#a78bfa' },
          { labelKey: 'actions.completed', value: counts.completed, color: '#34d399' },
        ].map(({ labelKey, value, color }) => (
          <div
            key={labelKey}
            className="glass-card rounded-2xl p-5"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}30`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
          >
            <p style={{ fontSize: '12px', color: tc.textDim, fontWeight: 500 }}>{t(labelKey)}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: 6 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Status Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-anim card-anim-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: tc.iconMuted }} />
          <input
            type="text"
            placeholder={t('actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex gap-1 rounded-xl p-1" style={{ background: tc.filterBg, border: `1px solid ${tc.filterBorder}` }}>
          {filterTabs.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className="rounded-lg px-3 py-1.5 text-xs transition-all"
              style={{
                background: statusFilter === key ? 'linear-gradient(135deg, #6D28D9, #EC4899)' : 'transparent',
                color: statusFilter === key ? '#fff' : tc.textDim,
                fontWeight: statusFilter === key ? 700 : 500,
                boxShadow: statusFilter === key ? '0 0 12px rgba(109,40,217,0.4)' : 'none',
              }}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden !p-0 card-anim card-anim-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${tc.borderSubtle}`, background: tc.tableHeaderBg }}>
                {['', t('actions.task'), t('actions.owner'), t('actions.dueDate'), t('actions.status'), t('actions.source')].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs uppercase tracking-wider"
                    style={{ color: tc.tableHeader, fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, i) => {
                const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';
                const cfg = statusConfig[item.status];
                return (
                  <tr
                    key={item.id}
                    className="meeting-row"
                    style={{ borderBottom: i < filteredItems.length - 1 ? `1px solid ${tc.rowDivider}` : 'none' }}
                  >
                    <td className="px-6 py-4">
                      <div
                        className="h-4 w-4 rounded cursor-pointer flex items-center justify-center transition-all"
                        style={{
                          border: item.status === 'completed' ? 'none' : `2px solid ${cfg.color}60`,
                          background: item.status === 'completed' ? 'linear-gradient(135deg, #059669, #34d399)' : 'transparent',
                          boxShadow: item.status === 'completed' ? '0 0 8px rgba(52,211,153,0.5)' : 'none',
                        }}
                      >
                        {item.status === 'completed' && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 shrink-0" style={{ color: cfg.color, opacity: 0.7 }} />
                        <span
                          className="text-sm"
                          style={{
                            color: item.status === 'completed' ? tc.textMuted : tc.textPrimary,
                            fontWeight: 500,
                            textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                          }}
                        >
                          {item.task}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs"
                          style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', color: 'white', fontWeight: 700 }}
                        >
                          {item.owner.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm" style={{ color: tc.textSecondary }}>{item.owner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" style={{ color: isOverdue ? '#f87171' : tc.iconMuted }} />
                        <span
                          className="text-sm"
                          style={{ color: isOverdue ? '#f87171' : tc.textDim, fontWeight: isOverdue ? 600 : 400 }}
                        >
                          {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {isOverdue && ` · ${t('actions.overdue')}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} t={t} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/meetings/${item.meetingId}`}
                        className="group flex items-center gap-1 text-sm transition-colors"
                        style={{ color: '#a78bfa' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#c4b5fd'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                      >
                        <span className="truncate max-w-[180px]">{item.meetingName}</span>
                        <ArrowRight className="h-3 w-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <p style={{ color: tc.textMuted, fontSize: '14px' }}>{t('actions.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
