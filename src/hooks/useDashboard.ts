import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics.api';

export function useSummary(statementId?: string) {
  return useQuery({
    queryKey: ['analytics', 'summary', statementId],
    queryFn: () => analyticsApi.getSummary(statementId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: analyticsApi.getTrends,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecurring() {
  return useQuery({
    queryKey: ['analytics', 'recurring'],
    queryFn: analyticsApi.getRecurring,
    staleTime: 5 * 60 * 1000,
  });
}

export function useForecast() {
  return useQuery({
    queryKey: ['analytics', 'forecast'],
    queryFn: analyticsApi.getForecast,
    staleTime: 5 * 60 * 1000,
  });
}
