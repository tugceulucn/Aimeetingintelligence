import { Link } from 'react-router';
import { useState } from 'react';
import { Search, Filter, ChevronDown, Video, MessageSquare, Users, Clock, Calendar } from 'lucide-react';
import { MeetingScoreBadge } from '../components/MeetingScoreBadge';
import { meetings } from '../data/mockData';
import { useApp, useThemeColors } from '../context/AppContext';

const platformColors: Record<string, string> = { zoom: '#2D8CFF', teams: '#5558AF', meet: '#34A853' };
const platformIcons = { zoom: Video, meet: MessageSquare, teams: Users };

export function Meetings() {
  const { t } = useApp();
  const tc = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeetings = meetings.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgDuration = Math.round(meetings.reduce((s, m) => s + m.duration, 0) / meetings.length);
  const avgScore = Math.round(meetings.reduce((s, m) => s + m.score, 0) / meetings.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-anim card-anim-1">
        <h1 className="page-title">{t('meetings.title')}</h1>
        <p className="page-subtitle">{t('meetings.subtitle')}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 card-anim card-anim-2">
        {[
          { labelKey: 'meetings.totalMeetings', value: meetings.length, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
          { labelKey: 'meetings.avgDuration', value: `${avgDuration}m`, color: '#22D3EE', glow: 'rgba(34,211,238,0.3)' },
          { labelKey: 'meetings.avgScore', value: avgScore, color: '#34d399', glow: 'rgba(52,211,153,0.3)' },
        ].map(({ labelKey, value, color, glow }) => (
          <div
            key={labelKey}
            className="glass-card rounded-2xl p-5"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${glow}`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
          >
            <p className="text-xs mb-2" style={{ color: tc.textDim, fontWeight: 500 }}>{t(labelKey)}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-anim card-anim-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: tc.iconMuted }} />
          <input
            type="text"
            placeholder={t('meetings.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl">
            <Filter className="h-4 w-4" />
            {t('meetings.filter')}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          <button className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl">
            <Calendar className="h-4 w-4" />
            {t('meetings.date')}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="glass-card rounded-2xl overflow-hidden !p-0 card-anim card-anim-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                {[
                  t('table.meeting'),
                  t('table.date'),
                  t('table.participants'),
                  t('table.duration'),
                  t('table.score'),
                  t('table.decisions'),
                  t('table.actions'),
                  t('table.platform'),
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs uppercase tracking-wider"
                    style={{ color: tc.tableHeader, fontWeight: 600, background: tc.tableHeaderBg }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMeetings.map((meeting, i) => {
                const PlatformIcon = platformIcons[meeting.platform];
                const pColor = platformColors[meeting.platform] || '#6D28D9';
                return (
                  <tr
                    key={meeting.id}
                    className="meeting-row cursor-pointer"
                    style={{ borderBottom: i < filteredMeetings.length - 1 ? `1px solid ${tc.rowDivider}` : 'none' }}
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/meetings/${meeting.id}`}
                        className="text-sm transition-colors"
                        style={{ color: tc.textPrimary, fontWeight: 600 }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tc.textPrimary; }}
                      >
                        {meeting.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: tc.textDim }}>
                      {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {meeting.participantNames.slice(0, 3).map((name, idx) => (
                            <div
                              key={idx}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs ring-2"
                              title={name}
                              style={{
                                background: 'linear-gradient(135deg, #6D28D9, #EC4899)',
                                color: 'white',
                                fontWeight: 700,
                              }}
                            >
                              {name.split(' ').map((n) => n[0]).join('')}
                            </div>
                          ))}
                        </div>
                        {meeting.participants > 3 && (
                          <span className="text-xs" style={{ color: tc.textMuted }}>
                            +{meeting.participants - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" style={{ color: tc.iconMuted }} />
                        <span className="text-sm" style={{ color: tc.textDim }}>{meeting.duration}m</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <MeetingScoreBadge score={meeting.score} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: tc.textSecondary, fontWeight: 600 }}>
                      {meeting.decisions}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: tc.textSecondary, fontWeight: 600 }}>
                      {meeting.actions}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: pColor, boxShadow: `0 0 6px ${pColor}99` }}
                        />
                        <PlatformIcon className="h-3.5 w-3.5" style={{ color: tc.iconDim }} />
                        <span className="text-xs capitalize" style={{ color: tc.textDim }}>
                          {meeting.platform}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredMeetings.length === 0 && (
          <div className="py-16 text-center">
            <p style={{ color: tc.textMuted, fontSize: '14px' }}>{t('meetings.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
