import { formatGHS } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { getCategoryColor, isIncomeType } from '@/utils/category';
import { TransactionBadge } from './TransactionBadge';
import type { Transaction } from '@/types/api.types';

interface TransactionRowProps {
  transaction: Transaction;
  onEditCategory?: (tx: Transaction) => void;
  compact?: boolean;
}

export function TransactionRow({ transaction: tx, onEditCategory, compact = false }: TransactionRowProps) {
  const amount = parseFloat(tx.amount);
  const isIncome = isIncomeType(tx.transType);
  const catColor = getCategoryColor(tx.category?.name);
  const merchant = tx.merchantName || tx.merchantNumber || '—';

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 py-3 border-b border-[rgba(0,0,0,0.06)]
                      dark:border-[rgba(255,255,255,0.06)] last:border-0"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${catColor}18` }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: catColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-body-mid font-medium text-on-surface dark:text-dark-text truncate">{merchant}</p>
          <p className="text-body-sm text-outline dark:text-dark-muted">{formatDateTime(tx.transactionDate)}</p>
        </div>

        <span
          className={`text-body-mid font-semibold ${isIncome ? 'text-primary dark:text-inverse-primary' : 'text-error'}`}
        >
          {isIncome ? '+' : '−'}
          {formatGHS(Math.abs(amount))}
        </span>
      </div>
    );
  }

  return (
    <tr
      className="border-b border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.04)]
                   hover:bg-surface-container-low dark:hover:bg-dark-surface-alt transition-colors group"
    >
      <td className="py-3 px-4 text-body-sm text-outline dark:text-dark-muted whitespace-nowrap">
        {formatDateTime(tx.transactionDate)}
      </td>
      <td className="py-3 px-4">
        <TransactionBadge type={tx.transType} />
      </td>
      <td className="py-3 px-4">
        <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">{merchant}</p>
        {tx.merchantNumber && (
          <p className="text-label text-outline dark:text-dark-muted">{tx.merchantNumber}</p>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
          <span className="text-body-sm text-on-surface dark:text-dark-text">
            {tx.category?.name ?? 'Uncategorised'}
          </span>
        </div>
      </td>
      <td
        className={`py-3 px-4 text-right font-semibold text-body-mid ${isIncome ? 'text-primary dark:text-inverse-primary' : 'text-error'}`}
      >
        {isIncome ? '+' : '−'}
        {formatGHS(Math.abs(amount))}
      </td>
      <td className="py-3 px-4 text-right text-body-sm text-outline dark:text-dark-muted">
        {parseFloat(tx.fees) > 0 ? formatGHS(tx.fees) : '—'}
      </td>
      <td className="py-3 px-4 text-right text-body-sm text-outline dark:text-dark-muted">
        {parseFloat(tx.eLevy) > 0 ? formatGHS(tx.eLevy) : '—'}
      </td>
      <td className="py-3 px-4 text-right text-body-sm text-on-surface dark:text-dark-text">
        {tx.balanceAfter ? formatGHS(tx.balanceAfter) : '—'}
      </td>
      <td className="py-3 px-4">
        {onEditCategory && (
          <button
            type="button"
            onClick={() => onEditCategory(tx)}
            className="opacity-0 group-hover:opacity-100 transition-opacity
                       p-1.5 rounded hover:bg-surface-container dark:hover:bg-dark-surface-alt"
          >
            <span className="material-symbols-outlined text-outline text-[16px]">edit</span>
          </button>
        )}
      </td>
    </tr>
  );
}
