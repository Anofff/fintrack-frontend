interface SkeletonCardProps {
  height?: string;
  className?: string;
}

function SkeletonLine({ width = 'w-full', height = 'h-3' }: { width?: string; height?: string }) {
  return (
    <div className={`${width} ${height} rounded bg-surface-container dark:bg-dark-surface-alt animate-pulse`} />
  );
}

export function SkeletonCard({ height = 'h-32', className = '' }: SkeletonCardProps) {
  return (
    <div className={`card p-4 ${height} ${className}`}>
      <div className="space-y-3">
        <SkeletonLine width="w-1/3" />
        <SkeletonLine width="w-2/3" height="h-6" />
        <SkeletonLine width="w-1/4" />
      </div>
    </div>
  );
}

export function SkeletonMetricGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} height="h-24" />
      ))}
    </div>
  );
}
