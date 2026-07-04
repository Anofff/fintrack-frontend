import { transactionsApi } from '@/api/transactions.api';
import type { Transaction, TransactionFilters } from '@/types/api.types';

const PAGE_SIZE = 100;
const MAX_PAGES = 50; // safety cap: 5,000 rows

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function transactionsToCsv(rows: Transaction[]): string {
  const headers = [
    'Date',
    'Type',
    'Merchant',
    'Category',
    'Amount',
    'Fees',
    'E-levy',
    'Balance after',
    'Ref ID',
  ];

  const lines = [headers.join(',')];

  for (const tx of rows) {
    lines.push(
      [
        tx.transactionDate,
        tx.transType,
        tx.merchantName ?? '',
        tx.category?.name ?? '',
        tx.amount,
        tx.fees,
        tx.eLevy,
        tx.balanceAfter ?? '',
        tx.refId ?? '',
      ]
        .map((cell) => escapeCsv(String(cell)))
        .join(','),
    );
  }

  return lines.join('\n');
}

function triggerDownload(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Fetches all pages matching filters (excluding page/limit) and downloads a CSV. */
export async function downloadTransactionsCsv(filters: TransactionFilters): Promise<number> {
  const baseFilters: TransactionFilters = { ...filters };
  delete baseFilters.page;
  delete baseFilters.limit;

  const all: Transaction[] = [];
  let page = 1;

  while (page <= MAX_PAGES) {
    const result = await transactionsApi.getAll({ ...baseFilters, page, limit: PAGE_SIZE });
    all.push(...result.data);
    if (!result.meta.hasNext) break;
    page += 1;
  }

  const csv = transactionsToCsv(all);
  const date = new Date().toISOString().slice(0, 10);
  triggerDownload(csv, `fintrack-transactions-${date}.csv`);
  return all.length;
}
