import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { statementsApi } from '@/api/statements.api';
import { useAuthStore } from '@/store/auth.store';
import type { Statement, UploadResult } from '@/types/api.types';

function sortStatements(statements: Statement[]): Statement[] {
  return [...statements].sort(
    (a, b) => new Date(b.periodStart).getTime() - new Date(a.periodStart).getTime(),
  );
}

function statementFromUpload(result: UploadResult, existing?: Statement): Statement {
  return {
    id: result.statementId,
    userId: existing?.userId ?? '',
    msisdn: result.msisdn,
    periodStart: result.period.start,
    periodEnd: result.period.end,
    totalDebit: String(result.totals.totalDebit),
    totalCredit: String(result.totals.totalCredit),
    totalFees: String(result.totals.totalFees),
    totalELevy: String(result.totals.totalELevy),
    uploadedAt: existing?.uploadedAt ?? new Date().toISOString(),
  };
}

function mergeUploadResult(statements: Statement[], result: UploadResult): Statement[] {
  const idx = statements.findIndex((s) => s.id === result.statementId);
  const merged = statementFromUpload(result, idx >= 0 ? statements[idx] : undefined);

  if (idx >= 0) {
    const next = [...statements];
    next[idx] = { ...statements[idx], ...merged, uploadedAt: new Date().toISOString() };
    return sortStatements(next);
  }

  return sortStatements([...statements, merged]);
}

/** Keep statements + analytics in sync immediately after a successful upload. */
export async function refreshAfterStatementUpload(qc: QueryClient, result: UploadResult) {
  qc.setQueryData<Statement[]>(['statements'], (prev) =>
    mergeUploadResult(prev ?? [], result),
  );

  try {
    let fresh = sortStatements(await statementsApi.getAll());

    if (!fresh.some((s) => s.id === result.statementId)) {
      try {
        const stmt = await statementsApi.getById(result.statementId);
        fresh = sortStatements([...fresh, stmt]);
      } catch {
        // mergeUploadResult below still adds a row from the upload payload.
      }
    }

    // Upload response totals are authoritative — merge on top in case list API lags.
    qc.setQueryData(['statements'], mergeUploadResult(fresh, result));
  } catch {
    // Optimistic patch above keeps the UI usable if list fetch fails.
  }

  await Promise.all([
    qc.invalidateQueries({ queryKey: ['transactions'] }),
    qc.refetchQueries({ queryKey: ['analytics'] }),
  ]);
}

export function useStatements() {
  const status = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: ['statements'],
    queryFn: async () => sortStatements(await statementsApi.getAll()),
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
    onSuccess: (result) => refreshAfterStatementUpload(qc, result),
  });
}
