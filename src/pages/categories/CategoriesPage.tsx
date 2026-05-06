import { useCategories } from '@/hooks/useCategories';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">Categories</h2>
        <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">
          Colours and labels used across your transactions
        </p>
      </div>

      {isLoading ? (
        <SkeletonCard height="h-48" />
      ) : !categories?.length ? (
        <EmptyState
          icon="sell"
          title="No categories"
          description="Categories are created by the backend when your account is set up."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="card p-4 flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: `${c.color}22` }}
              >
                <span aria-hidden>{c.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-body-mid font-semibold text-on-surface dark:text-dark-text">{c.name}</p>
                <p className="text-label text-outline dark:text-dark-muted mt-0.5">
                  {c.isIncome ? 'Income' : 'Expense'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-body-sm text-outline dark:text-dark-muted font-mono">{c.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
