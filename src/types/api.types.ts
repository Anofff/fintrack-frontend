export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isIncome: boolean;
}

export interface MerchantCacheEntry {
  id: string;
  merchantKey: string;
  categoryId: string;
  source: 'RULES' | 'USER';
  category: Category;
}

export interface Statement {
  id: string;
  userId: string;
  msisdn: string;
  periodStart: string;
  periodEnd: string;
  totalDebit: string;
  totalCredit: string;
  totalFees: string;
  totalELevy: string;
  uploadedAt: string;
}

export interface UploadResult {
  statementId: string;
  msisdn: string;
  period: { start: string; end: string };
  totals: { totalDebit: number; totalCredit: number; totalFees: number; totalELevy: number };
  summary: { inserted: number; skipped: number; errors: number };
}

export type TransactionType =
  | 'DEBIT'
  | 'CREDIT'
  | 'TRANSFER'
  | 'CASH_IN'
  | 'CASH_OUT'
  | 'PAYMENT'
  | 'ADJUSTMENT';

export interface Transaction {
  id: string;
  statementId: string;
  userId: string;
  categoryId: string | null;
  transactionDate: string;
  transType: TransactionType;
  amount: string;
  fees: string;
  eLevy: string;
  balanceBefore: string | null;
  balanceAfter: string | null;
  merchantName: string | null;
  merchantNumber: string | null;
  channel: string | null;
  refId: string | null;
  category: Category | null;
}

export interface PaginatedTransactions {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TransactionFilters {
  categoryId?: string;
  transType?: string;
  statementId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CategoryBreakdownItem {
  name: string;
  color: string;
  icon: string;
  total: number;
  count: number;
  percentage: number;
}

export interface BalancePoint {
  date: string;
  balance: number;
}

export interface MonthlySummary {
  totalSpent: number;
  totalReceived: number;
  netPosition: number;
  totalFees: number;
  totalELevy: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdownItem[];
  balanceTimeline: BalancePoint[];
}

export interface MonthTrend extends MonthlySummary {
  statementId: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
}

export interface RecurringPayment {
  merchantName: string;
  category: string;
  occurrences: number;
  averageAmount: number;
  lastSeen: string;
  nextExpected: string | null;
}

export interface BalanceForecast {
  currentBalance: number | null;
  dailyAverageSpend: number;
  forecastedSpendRemaining: number;
  forecastedEndBalance: number | null;
  daysLeft: number;
  willRunLow: boolean;
}
