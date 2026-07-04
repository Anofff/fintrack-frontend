import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export function NotFoundPage() {
  const status = useAuthStore((s) => s.status);
  const homeTo = status === 'authenticated' ? '/dashboard' : '/';

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex flex-col items-center justify-center px-gutter py-xl text-center">
      <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center mb-6">
        <span className="text-white font-bold text-lg">₵</span>
      </div>
      <p className="text-label text-primary uppercase tracking-wide mb-2">404</p>
      <h1 className="text-h2 font-semibold text-on-surface dark:text-dark-text mb-2">Page not found</h1>
      <p className="text-body-sm text-outline dark:text-dark-muted mb-8 max-w-sm">
        That URL does not exist in FinTrack₵. Check the address or head back to a known page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to={homeTo}
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-body-sm font-medium
                     hover:bg-primary-container transition-colors"
        >
          {status === 'authenticated' ? 'Go to dashboard' : 'Go to home'}
        </Link>
        {status === 'authenticated' && (
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg border border-outline-variant text-body-sm font-medium
                       text-on-surface dark:text-dark-text hover:bg-surface-container-low transition-colors"
          >
            Marketing site
          </Link>
        )}
        {status !== 'authenticated' && (
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg border border-outline-variant text-body-sm font-medium
                       text-on-surface dark:text-dark-text hover:bg-surface-container-low transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
