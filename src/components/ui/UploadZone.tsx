import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';

interface UploadZoneProps {
  onFile: (file: File) => void;
  loading?: boolean;
  /** Called when the user picks or clears a file (use to clear parent errors). */
  onSelectionChange?: (file: File | null) => void;
}

export function UploadZone({ onFile, loading = false, onSelectionChange }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);

  const selectFile = useCallback(
    (file: File | null) => {
      setSelectedFile(file);
      setRejectError(null);
      onSelectionChange?.(file);
    },
    [onSelectionChange],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (file) selectFile(file);
    },
    [selectFile],
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const code = rejections[0]?.errors[0]?.code;
    if (code === 'file-too-large') {
      setRejectError('File must be 10MB or smaller.');
    } else if (code === 'file-invalid-type') {
      setRejectError('Only PDF statements are supported.');
    } else {
      setRejectError('Could not accept that file. Use a MoMo PDF under 10MB.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: loading,
  });

  if (selectedFile) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-12 h-12 rounded-full bg-[rgba(0,105,76,0.1)] flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
        </div>
        <div className="text-center">
          <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">
            {selectedFile.name}
          </p>
          <p className="text-body-sm text-outline dark:text-dark-muted">
            {(selectedFile.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onFile(selectedFile)}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-body-mid font-medium
                       hover:bg-primary-container transition-colors disabled:opacity-60"
          >
            {loading ? 'Uploading…' : 'Upload and analyse'}
          </button>
          <button
            type="button"
            onClick={() => selectFile(null)}
            disabled={loading}
            className="px-4 py-2.5 text-outline dark:text-dark-muted text-body-sm
                       hover:text-on-surface disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-3 py-10 px-6
                    rounded-md border-2 border-dashed cursor-pointer transition-all
                    ${
                      isDragActive
                        ? 'border-primary bg-[rgba(0,105,76,0.06)]'
                        : 'border-outline-variant dark:border-[rgba(255,255,255,0.15)] hover:border-primary hover:bg-surface-container-low'
                    }
                    ${loading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <span className="material-symbols-outlined text-primary text-[40px]">cloud_upload</span>
        <div className="text-center">
          <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">
            {isDragActive ? 'Drop your statement here' : 'Drag and drop your MoMo PDF here'}
          </p>
          <p className="text-body-sm text-outline dark:text-dark-muted mt-1">
            or <span className="text-primary underline">browse files</span>
          </p>
        </div>
        <p className="text-label text-outline dark:text-dark-muted">
          Supports PDF up to 10MB · MTN MoMo statements only
        </p>
      </div>
      {rejectError && (
        <p className="text-body-sm text-error text-center" role="alert">
          {rejectError}
        </p>
      )}
    </div>
  );
}
