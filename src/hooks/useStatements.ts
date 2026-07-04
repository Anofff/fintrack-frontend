import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { statementsApi } from '@/api/statements.api';
import { useAuthStore } from '@/store/auth.store';

export function useStatements() {
  const status = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: ['statements'],
    queryFn: statementsApi.getAll,
    enabled: status === 'authenticated',
  });
}

export function useHasStatements() {
  const query = useStatements();
  return {
    ...query,
    hasStatements: (query.data?.length ?? 0) > 0,
  };
}

export function useUploadStatement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: statementsApi.upload,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['statements'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
