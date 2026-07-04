import { useEffect, useRef, useState } from 'react';
import { useTransactions, useUpdateCategory } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { TransactionRow } from '@/components/ui/TransactionRow';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { downloadTransactionsCsv } from '@/utils/csv';
import type { Transaction, TransactionFilters } from '@/types/api.types';

export function TransactionsPage() {
  const isDesktop = useIsDesktop();
  const listRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 20 });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { data, isLoading } = useTransactions(filters);
  const { data: categories } = useCategories();
  const { mutate: updateCat, isPending } = useUpdateCategory();

  useEffect(() => {
    const search = debouncedSearch.trim() || undefined;
    setFilters((f) => {
      if (f.search === search) return f;
      return { ...f, search, page: 1 };
    });
  }, [debouncedSearch]);

  const handlePage = (page: number) => {
    setFilters((f) => ({ ...f, page }));
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleExport = async () => {
    setExportError(null);
    setExporting(true);
    try {
      await downloadTransactionsCsv(filters);
    } catch {
      setExportError('Could not export transactions. Try again.');
    } finally {
      setExporting(false);
    }
  };

  const pagination =
    data && data.meta.pages > 0 ? (
      <div
        className="flex items-center justify-between px-4 py-3
                      border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]"
      >
        <p className="text-body-sm text-outline dark:text-dark-muted">
          Page {data.meta.page} of {data.meta.pages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!data.meta.hasPrev}
            onClick={() => handlePage((filters.page ?? 1) - 1)}
            className="px-3 py-1.5 rounded border border-outline-variant text-body-sm
                       text-on-surface dark:text-dark-text
                       disabled:opacity-40 hover:bg-surface-container-low dark:hover:bg-dark-surface-alt
                       transition-colors"
          >
            ← Previous
          </button>
          <button
            type="button"
            disabled={!data.meta.hasNext}
            onClick={() => handlePage((filters.page ?? 1) + 1)}
            className="px-3 py-1.5 rounded border border-outline-variant text-body-sm
                       text-on-surface dark:text-dark-text
                       disabled:opacity-40 hover:bg-surface-container-low dark:hover:bg-dark-surface-alt
                       transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">Transactions</h2>
          <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">
            Manage and track your financial flow
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={exporting || isLoading || !data?.meta.total}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border border-outline-variant
                     rounded-lg text-body-sm text-on-surface dark:text-dark-text
                     hover:bg-surface-container-low dark:hover:bg-dark-surface-alt transition-colors
                     disabled:opacity-50 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span className="hidden sm:inline">{exporting ? 'Exporting…' : 'Export CSV'}</span>
        </button>
      </div>

      {exportError && (
        <p className="text-body-sm text-error" role="alert">
          {exportError}
        </p>
      )}

      <div className="card p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                             text-outline text-[20px]"
              >
                search
              </span>
              <input
                type="text"
                value={searchInput}
                placeholder="Search merchant..."
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant
                           dark:border-[rgba(255,255,255,0.15)] bg-transparent
                           text-body-reg text-on-surface dark:text-dark-text
                           placeholder:text-outline dark:placeholder:text-dark-muted
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           transition-all"
              />
            </div>

            <select
              onChange={(e) =>
                setFilters((f) => ({ ...f, categoryId: e.target.value || undefined, page: 1 }))
              }
              className="px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                         bg-transparent text-body-reg text-on-surface dark:text-dark-text
                         focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All categories</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setFilters((f) => ({ ...f, transType: e.target.value || undefined, page: 1 }))
              }
              className="px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                         bg-transparent text-body-reg text-on-surface dark:text-dark-text
                         focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All types</option>
              {['DEBIT', 'CREDIT', 'TRANSFER', 'CASH_IN', 'CASH_OUT', 'PAYMENT'].map((t) => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 text-label text-outline dark:text-dark-muted">
              From
              <input
                type="date"
                value={filters.dateFrom ?? ''}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    dateFrom: e.target.value || undefined,
                    page: 1,
                  }))
                }
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-outline-variant
                           dark:border-[rgba(255,255,255,0.15)] bg-transparent
                           text-body-reg text-on-surface dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="flex-1 text-label text-outline dark:text-dark-muted">
              To
              <input
                type="date"
                value={filters.dateTo ?? ''}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    dateTo: e.target.value || undefined,
                    page: 1,
                  }))
                }
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-outline-variant
                           dark:border-[rgba(255,255,255,0.15)] bg-transparent
                           text-body-reg text-on-surface dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
        </div>

        {data && (
          <p className="text-body-sm text-outline dark:text-dark-muted mt-3">
            Showing {data.meta.total} transactions
          </p>
        )}
      </div>

      <div ref={listRef}>
        {isLoading ? (
          <SkeletonCard height="h-96" />
        ) : !data?.data.length ? (
          <EmptyState
            icon="receipt_long"
            title="No transactions found"
            description="Try adjusting your filters or upload a MoMo statement to get started."
          />
        ) : isDesktop ? (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low dark:bg-dark-surface-alt">
                  {['Date', 'Type', 'Merchant', 'Category', 'Amount', 'Fees', 'E-levy', 'Balance after', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="py-3 px-4 text-left text-label text-outline dark:text-dark-muted
                                           uppercase tracking-wide font-semibold"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {data.data.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} onEditCategory={setEditing} />
                ))}
              </tbody>
            </table>
            {pagination}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.06)]">
              {data.data.map((tx) => (
                <div key={tx.id} className="px-4">
                  <TransactionRow transaction={tx} compact onEditCategory={setEditing} />
                </div>
              ))}
            </div>
            {pagination}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Close"
            className="flex-1 bg-black/30 backdrop-blur-sm border-0 cursor-default"
            onClick={() => setEditing(null)}
          />
          <div
            className="w-full max-w-sm bg-surface-container-lowest dark:bg-dark-surface h-full
                          shadow-xl overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">Edit category</h3>
              <button type="button" onClick={() => setEditing(null)}>
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <p className="text-body-mid font-medium text-on-surface dark:text-dark-text mb-1">
              {editing.merchantName ?? 'Unknown merchant'}
            </p>
            <p className="text-body-sm text-outline dark:text-dark-muted mb-6">
              Currently: {editing.category?.name ?? 'Uncategorised'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(categories ?? []).map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  disabled={isPending}
                  onClick={() => {
                    updateCat({ id: editing.id, categoryId: cat.id });
                    setEditing(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-body-sm
                              text-left transition-all
                              ${
                                editing.categoryId === cat.id
                                  ? 'border-primary bg-[rgba(0,105,76,0.08)] text-primary dark:text-inverse-primary'
                                  : 'border-outline-variant dark:border-[rgba(255,255,255,0.1)] hover:border-primary'
                              }`}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-on-surface dark:text-dark-text truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
