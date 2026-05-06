import { api } from './axios';
import type { Category, MerchantCacheEntry } from '@/types/api.types';

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories').then((r) => r.data),

  getMerchantCache: () => api.get<MerchantCacheEntry[]>('/categories/merchant-cache').then((r) => r.data),

  assignMerchant: (merchantKey: string, categoryId: string) =>
    api.post('/categories/merchant-cache', { merchantKey, categoryId }).then((r) => r.data),
};
