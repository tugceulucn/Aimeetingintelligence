import { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, change, icon: Icon, trend = 'neutral' }: MetricCardProps) {
  const trendColor = trend === 'up' ? '#34d399' : trend === 'down' ? '#f87171' : 'rgba(255,255,255,0.4)';

  return (
    <div
      className="glass-card rounded-2xl p-6"
      style={{ transition: 'all 0.3s ease' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(109,40,217,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{title}</p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #6D28D9, #EC4899)',
            boxShadow: '0 0 16px rgba(109,40,217,0.5)',
          }}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p
        style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #a78bfa, #ec4899, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
      </p>
      {change && (
        <div className="flex items-center gap-1 mt-3">
          <TrendingUp className="h-3 w-3" style={{ color: trendColor }} />
          <p className="text-xs" style={{ color: trendColor, fontWeight: 600 }}>{change}</p>
        </div>
      )}
    </div>
  );
}
