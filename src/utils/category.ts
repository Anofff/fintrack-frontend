export const CATEGORY_COLORS: Record<string, string> = {
  'Shopping / POS': '#ba1a1a',
  'Cash Withdrawal': '#EF9F27',
  'Data Bundles': '#185FA5',
  'Airtime / Data': '#378ADD',
  'Loan Repayment': '#554cb9',
  'Person-to-Person': '#00694c',
  'Bank Transfer': '#0060a8',
  Utilities: '#6d7a73',
  Income: '#00694c',
  Uncategorised: '#6d7a73',
};

export function getCategoryColor(name: string | null | undefined): string {
  return CATEGORY_COLORS[name ?? ''] ?? '#6d7a73';
}

export const TRANS_TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  DEBIT: { bg: 'rgba(186,26,26,0.1)', text: '#ba1a1a', label: 'DEBIT' },
  CREDIT: { bg: 'rgba(0,105,76,0.1)', text: '#00694c', label: 'CREDIT' },
  TRANSFER: { bg: 'rgba(0,96,168,0.1)', text: '#0060a8', label: 'TRANSFER' },
  CASH_IN: { bg: 'rgba(0,105,76,0.1)', text: '#00694c', label: 'CASH IN' },
  CASH_OUT: { bg: 'rgba(239,159,39,0.1)', text: '#EF9F27', label: 'CASH OUT' },
  PAYMENT: { bg: 'rgba(85,76,185,0.1)', text: '#554cb9', label: 'PAYMENT' },
  ADJUSTMENT: { bg: 'rgba(0,105,76,0.1)', text: '#00694c', label: 'ADJUSTMENT' },
};

export function isIncomeType(transType: string): boolean {
  return ['CASH_IN', 'CREDIT', 'ADJUSTMENT'].includes(transType);
}

/** Stable key for merchant-cache lookups (matches backend-eguide normalization). */
export function normalizeMerchantKey(name: string | null | undefined): string | null {
  if (!name) return null;
  const key = name.trim().toLowerCase().replace(/\s+/g, ' ');
  return key.length > 0 ? key : null;
}
