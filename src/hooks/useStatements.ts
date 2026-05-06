import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { statementsApi } from '@/api/statements.api';

export function useStatements() {
  return useQuery({
    queryKey: ['statements'],
    queryFn: statementsApi.getAll,
  });
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
