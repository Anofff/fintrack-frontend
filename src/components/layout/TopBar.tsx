import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/statements': 'Statements',
  '/categories': 'Categories',
  '/settings': 'Settings',
};

export function TopBar() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'FinTrack₵';

  return (
    <header
      className="h-[60px] flex-shrink-0 flex items-center justify-between px-xl
                       bg-surface-container-lowest dark:bg-dark-surface
                       border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]"
    >
      <h1 className="text-h3 font-semibold text-on-surface dark:text-dark-text">{title}</h1>
      <ThemeToggle />
    </header>
  );
}
