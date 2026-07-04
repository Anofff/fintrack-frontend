import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';
import { useAuthStore } from '@/store/auth.store';

export function useCategories() {
  const status = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: Infinity,
    enabled: status === 'authenticated',
  });
}

export function useMerchantCache() {
  const status = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: ['merchant-cache'],
    queryFn: categoriesApi.getMerchantCache,
    enabled: status === 'authenticated',
  });
}
