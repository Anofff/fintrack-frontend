import { Link, useSearchParams } from 'react-router-dom';
import { useSummary, useRecurring, useForecast } from '@/hooks/useDashboard';
import { useTransactions } from '@/hooks/useTransactions';
import { useStatements, useUploadStatement } from '@/hooks/useStatements';
import { MetricCard } from '@/components/ui/MetricCard';
import { CategoryBar } from '@/components/ui/CategoryBar';
import { TransactionRow } from '@/components/ui/TransactionRow';
import { BalanceLineChart } from '@/components/charts/BalanceLineChart';
import { SkeletonMetricGrid, SkeletonCard } from '@/components/ui/SkeletonCard';
import { formatGHS, formatGHSChange } from '@/utils/currency';
import { formatDate, formatPeriod } from '@/utils/date';
import { UploadZone } from '@/components/ui/UploadZone';

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: statements } = useStatements();

  const fromUrl = searchParams.get('statementId');
  const activeStmt =
    fromUrl && statements?.some((s) => s.id === fromUrl) ? fromUrl : statements?.[0]?.id;

  const setActiveStmt = (id: string) => {
    setSearchParams({ statementId: id });
  };

  const { data: summary, isLoading: summaryLoading } = useSummary(activeStmt);
  const { data: recurring } = useRecurring();
  const { data: forecast } = useForecast();
  const { data: txData } = useTransactions({ limit: 6, statementId: activeStmt });
  const { mutate: upload, isPending: uploading } = useUploadStatement();

  if (statements && statements.length === 0) {
    return (
      <div className="max-w-lg mx-auto pt-8">
        <h2 className="text-h2 font-semibold text-on-surface dark:text-dark-text mb-1">Welcome to FinTrack₵</h2>
        <p className="text-body-sm text-outline dark:text-dark-muted mb-6">
          Upload your first MoMo statement to get started
        </p>
        <div className="card p-6">
          <UploadZone onFile={(file) => upload(file)} loading={uploading} />
        </div>
      </div>
    );
  }

  const latestStatement = statements?.find((s) => s.id === activeStmt) ?? statements?.[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">
            {latestStatement ? formatPeriod(latestStatement.periodStart) : 'Dashboard'}
          </h2>
          {latestStatement && (
            <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">
              MoMo {latestStatement.msisdn}
            </p>
          )}
          {statements && statements.length > 1 && (
            <label className="mt-3 block text-label text-on-surface-variant dark:text-dark-muted">
              Statement
              <select
                value={activeStmt ?? ''}
                onChange={(e) => setActiveStmt(e.target.value)}
                className="mt-1 block w-full max-w-xs px-3 py-2 rounded-lg border border-outline-variant
                           dark:border-[rgba(255,255,255,0.15)] bg-transparent text-body-reg
                           text-on-surface dark:text-dark-text"
              >
                {statements.map((s) => (
                  <option key={s.id} value={s.id}>
                    {formatPeriod(s.periodStart)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <Link
          to="/statements"
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                     rounded-lg text-body-sm font-medium hover:bg-primary-container transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Upload statement
        </Link>
      </div>

      {forecast?.willRunLow && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                        bg-[rgba(239,159,39,0.1)] border border-[rgba(239,159,39,0.3)]"
        >
          <span className="material-symbols-outlined text-[#EF9F27] text-[20px]">warning</span>
          <p className="text-body-sm text-on-surface dark:text-dark-text">
            Your balance may run low around the end of the month. Projected end balance:{' '}
            <strong>{formatGHS(forecast.forecastedEndBalance)}</strong>
          </p>
        </div>
      )}

      {summaryLoading ? (
        <SkeletonMetricGrid />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total spent" value={formatGHS(summary?.totalSpent)} variant="negative" />
          <MetricCard label="Total received" value={formatGHS(summary?.totalReceived)} variant="positive" />
          <MetricCard
            label="Net position"
            value={formatGHSChange(summary?.netPosition ?? 0)}
            variant={(summary?.netPosition ?? 0) >= 0 ? 'positive' : 'negative'}
          />
          <MetricCard label="Transactions" value={String(summary?.transactionCount ?? 0)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">Spending by category</h3>
          </div>
          {summaryLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-surface-container dark:bg-dark-surface-alt rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(summary?.categoryBreakdown ?? []).map((cat) => (
                <CategoryBar
                  key={cat.name}
                  name={cat.name}
                  color={cat.color}
                  amount={cat.total}
                  percentage={cat.percentage}
                  count={cat.count}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 card p-4">
          <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-4">Balance this month</h3>
          {summaryLoading ? (
            <SkeletonCard height="h-[200px]" />
          ) : (
            <BalanceLineChart data={summary?.balanceTimeline ?? []} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">Recent transactions</h3>
            <Link
              to="/transactions"
              className="text-body-sm text-primary dark:text-inverse-primary font-medium"
            >
              View all →
            </Link>
          </div>
          <div>
            {(txData?.data ?? []).length === 0 ? (
              <p className="text-body-sm text-outline dark:text-dark-muted py-4">No transactions in this view yet.</p>
            ) : (
              (txData?.data ?? []).map((tx) => <TransactionRow key={tx.id} transaction={tx} compact />)
            )}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-1">Recurring payments</h3>
          <p className="text-body-sm text-outline dark:text-dark-muted mb-4">Detected across your statements</p>
          {(recurring ?? []).length === 0 ? (
            <p className="text-body-sm text-outline dark:text-dark-muted">
              Upload more statements to detect recurring payments.
            </p>
          ) : (
            <div className="space-y-3">
              {(recurring ?? []).slice(0, 4).map((r) => (
                <div
                  key={r.merchantName}
                  className="flex items-center justify-between py-2
                                                     border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]
                                                     last:border-0"
                >
                  <div>
                    <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">
                      {r.merchantName}
                    </p>
                    <p className="text-body-sm text-outline dark:text-dark-muted">
                      {r.occurrences}× · {formatGHS(r.averageAmount)} avg
                    </p>
                  </div>
                  {r.nextExpected && (
                    <div className="text-right">
                      <p className="text-label text-[#EF9F27] font-semibold">Next expected</p>
                      <p className="text-body-sm text-outline dark:text-dark-muted">
                        {formatDate(r.nextExpected)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 lg:col-span-2">
            <p className="text-label text-outline dark:text-dark-muted uppercase tracking-wide mb-1">
              MoMo fees paid
            </p>
            <p className="text-h3 font-semibold text-[#EF9F27]">{formatGHS(summary.totalFees)}</p>
            <p className="text-body-sm text-outline dark:text-dark-muted mt-1">This period</p>
          </div>
          <div className="card p-4 lg:col-span-2">
            <p className="text-label text-outline dark:text-dark-muted uppercase tracking-wide mb-1">
              E-levy paid
            </p>
            <p className="text-h3 font-semibold text-[#EF9F27]">{formatGHS(summary.totalELevy)}</p>
            <p className="text-body-sm text-outline dark:text-dark-muted mt-1">Government levy</p>
          </div>
        </div>
      )}
    </div>
  );
}
