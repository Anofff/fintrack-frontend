import { api } from './axios';
import type { BalanceForecast, MonthlySummary, MonthTrend, RecurringPayment } from '@/types/api.types';

export const analyticsApi = {
  getSummary: (statementId?: string) =>
    api.get<MonthlySummary>('/analytics/summary', { params: { statementId } }).then((r) => r.data),

  getTrends: () => api.get<MonthTrend[]>('/analytics/trends').then((r) => r.data),

  getRecurring: () => api.get<RecurringPayment[]>('/analytics/recurring').then((r) => r.data),

  getForecast: () => api.get<BalanceForecast>('/analytics/forecast').then((r) => r.data),
};
