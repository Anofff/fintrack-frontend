import { Outlet } from 'react-router-dom';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { MobileHeader } from './MobileHeader';

export function AppShell() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="flex h-screen bg-background dark:bg-dark-bg overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />

          <main className="flex-1 overflow-y-auto p-xl">
            <div className="max-w-[1240px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <MobileHeader />

      <main className="pt-16 pb-24 px-gutter">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
