import { Navigate, Outlet } from 'react-router-dom';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { useStatements } from '@/hooks/useStatements';

/** Blocks the app shell until the user has uploaded at least one statement. */
export function RequireStatements() {
  const { data, isLoading, isError } = useStatements();

  if (isLoading) {
    return <AuthLoader />;
  }

  // On API error, let the shell render so pages can show their own error/empty UI.
  if (!isError && (data?.length ?? 0) === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
