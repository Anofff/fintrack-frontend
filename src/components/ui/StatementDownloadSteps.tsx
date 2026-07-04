const STEPS = [
  'Open the MoMo app → tap My Account',
  'Select Statement → choose the month → tap Download',
  'Upload the PDF below',
] as const;

interface StatementDownloadStepsProps {
  className?: string;
  /** Override the last step when the upload zone is elsewhere. */
  finalStep?: string;
}

export function StatementDownloadSteps({
  className = '',
  finalStep = STEPS[2],
}: StatementDownloadStepsProps) {
  const steps = [STEPS[0], STEPS[1], finalStep];

  return (
    <div
      className={`p-3 rounded-lg bg-surface-container-low dark:bg-dark-surface-alt ${className}`}
    >
      <p className="text-body-sm font-medium text-on-surface dark:text-dark-text mb-2">
        How to get your statement
      </p>
      <ol className="space-y-1.5">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-2 text-body-sm text-outline dark:text-dark-muted">
            <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
