import { formatGHS } from '@/utils/currency';

interface CategoryBarProps {
  name: string;
  color: string;
  amount: number;
  percentage: number;
  count?: number;
}

export function CategoryBar({ name, color, amount, percentage, count }: CategoryBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-body-sm text-on-surface dark:text-dark-text truncate">{name}</span>
          <span className="text-label text-on-surface dark:text-dark-text ml-2 flex-shrink-0">
            {formatGHS(amount)}
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container dark:bg-dark-surface-alt rounded-full">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
          />
        </div>
        {count !== undefined && (
          <p className="text-label text-outline dark:text-dark-muted mt-0.5">
            {count} transaction{count !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <span className="text-label text-outline dark:text-dark-muted flex-shrink-0 w-10 text-right">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}
