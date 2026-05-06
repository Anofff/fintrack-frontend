import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadZoneProps {
  onFile: (file: File) => void;
  loading?: boolean;
}

export function UploadZone({ onFile, loading = false }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (file) setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-12 h-12 rounded-full bg-[rgba(0,105,76,0.1)] flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
        </div>
        <div className="text-center">
          <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">{selectedFile.name}</p>
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
            {loading ? 'Uploading...' : 'Upload and analyse'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="px-4 py-2.5 text-outline dark:text-dark-muted text-body-sm hover:text-on-surface"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center gap-3 py-10 px-6
                  rounded-md border-2 border-dashed cursor-pointer transition-all
                  ${
                    isDragActive
                      ? 'border-primary bg-[rgba(0,105,76,0.06)]'
                      : 'border-outline-variant dark:border-[rgba(255,255,255,0.15)] hover:border-primary hover:bg-surface-container-low'
                  }`}
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
  );
}
