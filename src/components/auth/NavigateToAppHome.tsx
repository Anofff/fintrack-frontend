import { Navigate } from 'react-router-dom';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { useStatements } from '@/hooks/useStatements';
import { resolvePostAuthPath } from '@/utils/navigation';

interface NavigateToAppHomeProps {
  /** Optional `?next=` from the login URL. */
  nextParam?: string | null;
}

/** Sends an authenticated user to onboarding or the app (honouring safe `next`). */
export function NavigateToAppHome({ nextParam }: NavigateToAppHomeProps) {
  const { data, isLoading, isError } = useStatements();

  if (isLoading) {
    return <AuthLoader />;
  }

  if (isError) {
    return <Navigate to="/dashboard" replace />;
  }

  const path = resolvePostAuthPath({
    hasStatements: (data?.length ?? 0) > 0,
    nextParam,
  });

  return <Navigate to={path} replace />;
}
