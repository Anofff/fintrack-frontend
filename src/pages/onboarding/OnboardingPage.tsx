import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UploadZone } from '@/components/ui/UploadZone';
import { UploadError } from '@/components/ui/UploadError';
import { StatementDownloadSteps } from '@/components/ui/StatementDownloadSteps';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { useLogout } from '@/hooks/useAuth';
import { useStatements, useUploadStatement } from '@/hooks/useStatements';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { data: statements, isLoading } = useStatements();
  const { mutate: upload, isPending, error, reset } = useUploadStatement();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return <AuthLoader />;
  }

  if ((statements?.length ?? 0) > 0) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg px-gutter py-xl">
      <div className="max-w-lg mx-auto pt-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">₵</span>
          </div>
          <span className="text-h3 font-semibold text-on-surface dark:text-dark-text">FinTrack₵</span>
        </div>

        <p className="text-label text-primary uppercase tracking-wide mb-2">Step 1 of 1</p>
        <h1 className="text-h2 font-semibold text-on-surface dark:text-dark-text mb-1">
          Upload your first statement
        </h1>
        <p className="text-body-sm text-outline dark:text-dark-muted mb-6">
          FinTrack₵ turns your MTN MoMo PDF into spending categories, trends, and fee tracking.
          Nothing appears on your dashboard until this upload succeeds.
        </p>

        <StatementDownloadSteps className="mb-4" />

        <div className="card p-6">
          <UploadZone
            onFile={(file) => {
              reset();
              upload(file, {
                onSuccess: () => navigate('/dashboard', { replace: true }),
              });
            }}
            onSelectionChange={() => reset()}
            loading={isPending}
          />
          <UploadError error={error} />
        </div>

        <p className="text-body-sm text-outline dark:text-dark-muted mt-6 text-center">
          Wrong account?{' '}
          <button
            type="button"
            onClick={() => logout()}
            className="text-primary dark:text-inverse-primary font-medium hover:underline"
          >
            Sign out
          </button>
          {' · '}
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
