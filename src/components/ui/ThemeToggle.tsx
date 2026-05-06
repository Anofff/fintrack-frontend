import { useUIStore } from '@/store/ui.store';

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useUIStore();

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="w-9 h-9 flex items-center justify-center rounded-full
                 hover:bg-surface-container-low dark:hover:bg-dark-surface-alt
                 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="material-symbols-outlined text-on-surface-variant dark:text-dark-muted text-[20px]">
        {darkMode ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
