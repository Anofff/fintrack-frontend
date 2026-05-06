import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/transactions', icon: 'receipt_long', label: 'Activity' },
  { path: '/analytics', icon: 'analytics', label: 'Insights' },
  { path: '/statements', icon: 'description', label: 'Reports' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
] as const;

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe
                    bg-surface-container-lowest dark:bg-dark-surface
                    border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]
                    shadow-nav"
    >
      <div className="flex justify-around items-center h-20 px-2">
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl
               transition-all duration-150 active:scale-95
               ${
                 isActive
                   ? 'text-primary dark:text-inverse-primary bg-[rgba(0,105,76,0.08)]'
                   : 'text-outline dark:text-dark-muted hover:text-primary'
               }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span className="text-[11px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
