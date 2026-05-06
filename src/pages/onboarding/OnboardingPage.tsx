import { useNavigate } from 'react-router-dom';
import { UploadZone } from '@/components/ui/UploadZone';
import { useUploadStatement } from '@/hooks/useStatements';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { mutate: upload, isPending } = useUploadStatement();

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg px-gutter py-xl">
      <div className="max-w-lg mx-auto pt-8">
        <h1 className="text-h2 font-semibold text-on-surface dark:text-dark-text mb-1">Welcome to FinTrack₵</h1>
        <p className="text-body-sm text-outline dark:text-dark-muted mb-6">
          Upload your first MTN MoMo PDF statement to unlock your dashboard.
        </p>
        <div className="card p-6">
          <UploadZone
            onFile={(file) =>
              upload(file, {
                onSuccess: () => navigate('/dashboard'),
              })
            }
            loading={isPending}
          />
        </div>
      </div>
    </div>
  );
}
