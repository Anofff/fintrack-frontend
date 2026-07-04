export function AuthLoader() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
        <span className="text-white font-bold text-lg">₵</span>
      </div>
      <div
        className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
        role="status"
        aria-label="Loading"
      />
      <p className="text-body-sm text-outline dark:text-dark-muted">Loading FinTrack₵…</p>
    </div>
  );
}
