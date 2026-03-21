interface MeetingScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MeetingScoreBadge({ score, size = 'md' }: MeetingScoreBadgeProps) {
  const getStyle = (score: number) => {
    if (score >= 80) return {
      background: 'linear-gradient(135deg, #059669, #10b981)',
      boxShadow: '0 0 12px rgba(16,185,129,0.5)',
    };
    if (score >= 65) return {
      background: 'linear-gradient(135deg, #6D28D9, #7c3aed)',
      boxShadow: '0 0 12px rgba(109,40,217,0.5)',
    };
    return {
      background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
      boxShadow: '0 0 12px rgba(239,68,68,0.4)',
    };
  };

  const sizeStyle = {
    sm: { fontSize: '11px', padding: '2px 8px' },
    md: { fontSize: '12px', padding: '4px 10px' },
    lg: { fontSize: '14px', padding: '6px 14px' },
  };

  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg text-white"
      style={{
        ...getStyle(score),
        ...sizeStyle[size],
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      {score}
      <span style={{ opacity: 0.7, fontSize: '9px' }}>/100</span>
    </span>
  );
}
