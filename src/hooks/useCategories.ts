import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: Infinity,
  });
}

export function useMerchantCache() {
  return useQuery({
    queryKey: ['merchant-cache'],
    queryFn: categoriesApi.getMerchantCache,
  });
}
