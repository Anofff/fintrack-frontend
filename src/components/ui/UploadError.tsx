import { getApiErrorMessage } from '@/utils/errors';

interface UploadErrorProps {
  error: unknown;
}

export function UploadError({ error }: UploadErrorProps) {
  if (!error) return null;

  return (
    <div
      className="flex items-start gap-2 mt-4 px-3 py-2.5 rounded-lg
                 bg-[rgba(186,26,26,0.08)] border border-[rgba(186,26,26,0.25)]"
      role="alert"
    >
      <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
      <p className="text-body-sm text-error">
        {getApiErrorMessage(
          error,
          'Upload failed. Check that the file is a valid MoMo PDF and try again.',
        )}
      </p>
    </div>
  );
}
