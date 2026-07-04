import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions.api';
import { categoriesApi } from '@/api/categories.api';
import { normalizeMerchantKey } from '@/utils/category';
import type { TransactionFilters } from '@/types/api.types';

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.getAll(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      categoryId,
      merchantName,
    }: {
      id: string;
      categoryId: string;
      /** Used to teach merchant-cache for future uploads. */
      merchantName?: string | null;
    }) => {
      const updated = await transactionsApi.updateCategory(id, categoryId);

      const merchantKey = normalizeMerchantKey(merchantName);
      if (merchantKey) {
        try {
          await categoriesApi.assignMerchant(merchantKey, categoryId);
        } catch {
          // Transaction category already saved; cache is best-effort.
        }
      }

      return updated;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      qc.invalidateQueries({ queryKey: ['merchant-cache'] });
    },
  });
}
