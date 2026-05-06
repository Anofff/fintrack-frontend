import { api } from './axios';
import type { PaginatedTransactions, Transaction, TransactionFilters } from '@/types/api.types';

export const transactionsApi = {
  getAll: (filters: TransactionFilters = {}) =>
    api.get<PaginatedTransactions>('/transactions', { params: filters }).then((r) => r.data),

  updateCategory: (id: string, categoryId: string) =>
    api.patch<Transaction>(`/transactions/${id}/category`, { categoryId }).then((r) => r.data),
};
