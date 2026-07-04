import { Navigate, useNavigate } from 'react-router-dom';
import { UploadZone } from '@/components/ui/UploadZone';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { useStatements, useUploadStatement } from '@/hooks/useStatements';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { data: statements, isLoading } = useStatements();
  const { mutate: upload, isPending, error } = useUploadStatement();

  if (isLoading) {
    return <AuthLoader />;
  }

  if ((statements?.length ?? 0) > 0) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg px-gutter py-xl">
      <div className="max-w-lg mx-auto pt-8">
        <h1 className="text-h2 font-semibold text-on-surface dark:text-dark-text mb-1">
          Welcome to FinTrack₵
        </h1>
        <p className="text-body-sm text-outline dark:text-dark-muted mb-6">
          Upload your first MTN MoMo PDF statement to unlock your dashboard.
        </p>
        <div className="card p-6">
          <UploadZone
            onFile={(file) =>
              upload(file, {
                onSuccess: () => navigate('/dashboard', { replace: true }),
              })
            }
            loading={isPending}
          />
          {error && (
            <p className="text-body-sm text-error mt-4" role="alert">
              Upload failed. Check that the file is a valid MoMo PDF and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
