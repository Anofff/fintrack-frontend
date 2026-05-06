interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  variant?: 'default' | 'positive' | 'negative';
}

export function MetricCard({ label, value, change, variant = 'default' }: MetricCardProps) {
  const valueColor = {
    default: 'text-on-surface dark:text-dark-text',
    positive: 'text-primary dark:text-inverse-primary',
    negative: 'text-error',
  }[variant];

  const changeColor = {
    default: 'text-outline',
    positive: 'text-primary dark:text-inverse-primary',
    negative: 'text-error',
  }[variant];

  return (
    <div className="card p-4">
      <p className="text-label text-on-surface-variant dark:text-dark-muted mb-1 uppercase tracking-wide">{label}</p>
      <p className={`text-h3 font-semibold ${valueColor} leading-tight`}>{value}</p>
      {change && <p className={`text-body-sm mt-1 ${changeColor}`}>{change}</p>}
    </div>
  );
}
