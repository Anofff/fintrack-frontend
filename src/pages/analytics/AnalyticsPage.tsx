import { useForecast, useSummary, useTrends } from '@/hooks/useDashboard';
import { SpendingBarChart } from '@/components/charts/SpendingBarChart';
import { BalanceLineChart } from '@/components/charts/BalanceLineChart';
import { TrendGroupedChart } from '@/components/charts/TrendGroupedChart';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { formatGHS } from '@/utils/currency';

export function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: trends, isLoading: trendsLoading } = useTrends();
  const { data: forecast, isLoading: forecastLoading } = useForecast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">Analytics</h2>
        <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">
          Trends, categories, and balance trajectory
        </p>
      </div>

      {!forecastLoading && forecast && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-label text-outline dark:text-dark-muted uppercase tracking-wide mb-1">
              Daily avg spend
            </p>
            <p className="text-h3 font-semibold text-on-surface dark:text-dark-text">
              {formatGHS(forecast.dailyAverageSpend)}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-label text-outline dark:text-dark-muted uppercase tracking-wide mb-1">
              Forecasted spend (remaining)
            </p>
            <p className="text-h3 font-semibold text-on-surface dark:text-dark-text">
              {formatGHS(forecast.forecastedSpendRemaining)}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-label text-outline dark:text-dark-muted uppercase tracking-wide mb-1">
              Days left in view
            </p>
            <p className="text-h3 font-semibold text-on-surface dark:text-dark-text">{forecast.daysLeft}</p>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-4">Month-on-month</h3>
        {trendsLoading ? (
          <SkeletonCard height="h-[280px]" />
        ) : trends && trends.length > 0 ? (
          <TrendGroupedChart trends={trends} />
        ) : (
          <p className="text-body-sm text-outline dark:text-dark-muted">Upload statements to see trends.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-4">Spending by category</h3>
          {summaryLoading ? (
            <SkeletonCard height="h-[220px]" />
          ) : summary && summary.categoryBreakdown.length > 0 ? (
            <SpendingBarChart data={summary.categoryBreakdown} />
          ) : (
            <p className="text-body-sm text-outline dark:text-dark-muted">No category data yet.</p>
          )}
        </div>
        <div className="card p-4">
          <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-4">Balance timeline</h3>
          {summaryLoading ? (
            <SkeletonCard height="h-[200px]" />
          ) : (
            <BalanceLineChart data={summary?.balanceTimeline ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
