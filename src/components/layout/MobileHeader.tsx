import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/statements': 'Statements',
  '/categories': 'Categories',
  '/settings': 'Settings',
};

export function MobileHeader() {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const title = PAGE_TITLES[pathname] ?? 'FinTrack₵';

  return (
    <header
      className="fixed top-0 w-full z-50 h-16
                       bg-surface-container-lowest dark:bg-dark-surface
                       border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]
                       shadow-sm flex items-center justify-between px-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-label font-bold">
            {(user?.fullName ?? 'U').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-h4 font-semibold text-on-surface dark:text-dark-text leading-tight truncate">
            {title}
          </h1>
          {user && (
            <p className="text-label text-outline dark:text-dark-muted leading-tight truncate">
              {user.fullName ?? user.email}
            </p>
          )}
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
