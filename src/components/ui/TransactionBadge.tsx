import { TRANS_TYPE_STYLES } from '@/utils/category';
import type { TransactionType } from '@/types/api.types';

interface TransactionBadgeProps {
  type: TransactionType;
}

export function TransactionBadge({ type }: TransactionBadgeProps) {
  const style = TRANS_TYPE_STYLES[type] ?? TRANS_TYPE_STYLES.DEBIT;

  return (
    <span
      className="inline-block text-label px-2 py-0.5 rounded-full font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}
