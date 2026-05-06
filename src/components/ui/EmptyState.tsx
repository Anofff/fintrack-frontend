import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div
        className="w-16 h-16 rounded-full bg-surface-container dark:bg-dark-surface-alt
                      flex items-center justify-center mb-4"
      >
        <span className="material-symbols-outlined text-outline dark:text-dark-muted text-[32px]">{icon}</span>
      </div>
      <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-2">{title}</h3>
      <p className="text-body-sm text-outline dark:text-dark-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
