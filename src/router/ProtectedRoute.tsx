import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { AuthLoader } from '@/components/auth/AuthLoader';

export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === 'loading') {
    return <AuthLoader />;
  }

  if (status === 'anonymous') {
    const next = `${location.pathname}${location.search}`;
    const search = next && next !== '/' ? `?next=${encodeURIComponent(next)}` : '';
    return <Navigate to={`/login${search}`} replace />;
  }

  return <Outlet />;
}
