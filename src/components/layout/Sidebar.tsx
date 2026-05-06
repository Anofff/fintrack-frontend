import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/transactions', icon: 'receipt_long', label: 'Transactions' },
  { path: '/analytics', icon: 'analytics', label: 'Analytics' },
  { path: '/statements', icon: 'description', label: 'Statements' },
  { path: '/categories', icon: 'sell', label: 'Categories' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
] as const;

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  return (
    <aside
      className="w-[240px] h-screen flex-shrink-0 flex flex-col
                      bg-surface-container-lowest dark:bg-dark-surface
                      border-r border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]"
    >
      <div
        className="h-[60px] flex items-center px-lg border-b border-[rgba(0,0,0,0.06)]
                      dark:border-[rgba(255,255,255,0.06)]"
      >
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">₵</span>
        </div>
        <span className="ml-2.5 text-h4 font-semibold text-on-surface dark:text-dark-text tracking-tight">
          FinTrack₵
        </span>
      </div>

      <nav className="flex-1 px-sm py-md space-y-xs overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
               text-body-mid font-medium
               ${
                 isActive
                   ? 'bg-[rgba(0,105,76,0.1)] text-primary dark:text-inverse-primary border-l-3 border-primary'
                   : 'text-on-surface-variant dark:text-dark-muted hover:bg-surface-container-low dark:hover:bg-dark-surface-alt'
               }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-sm py-md border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-label font-bold">
              {(user?.fullName ?? user?.email ?? 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-on-surface dark:text-dark-text truncate">
              {user?.fullName ?? 'My Account'}
            </p>
            <p className="text-label text-outline dark:text-dark-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg
                     text-body-sm text-outline dark:text-dark-muted
                     hover:bg-surface-container-low dark:hover:bg-dark-surface-alt
                     transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
