import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStatements, useUploadStatement } from '@/hooks/useStatements';
import { UploadZone } from '@/components/ui/UploadZone';
import { UploadError } from '@/components/ui/UploadError';
import { StatementDownloadSteps } from '@/components/ui/StatementDownloadSteps';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatGHS } from '@/utils/currency';
import { formatDate, formatPeriod } from '@/utils/date';

export function StatementsPage() {
  const { data: statements, isLoading, isFetching } = useStatements();
  const { mutate: upload, isPending, data: uploadResult, error, reset } = useUploadStatement();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">Statements</h2>
          <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">Your uploaded MoMo statements</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setUploadKey((k) => k + 1);
            setShowUpload(true);
          }}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg
                     text-body-sm font-medium hover:bg-primary-container transition-colors
                     disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Upload statement
        </button>
      </div>

      {uploadResult && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg
                        bg-[rgba(0,105,76,0.1)] border border-[rgba(0,105,76,0.3)]"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            <p className="text-body-sm text-on-surface dark:text-dark-text">
              Statement uploaded — <strong>{uploadResult.summary.inserted}</strong> transactions imported
              {uploadResult.summary.skipped > 0 && `, ${uploadResult.summary.skipped} duplicates skipped`}
            </p>
          </div>
          <button type="button" onClick={() => reset()} className="text-primary text-label font-semibold">
            Dismiss
          </button>
        </div>
      )}

      <UploadError error={error} />

      {showUpload && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">Upload MoMo statement</h3>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setShowUpload(false);
                if (error) reset();
              }}
              className="disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-outline">close</span>
            </button>
          </div>
          <UploadZone
            key={uploadKey}
            onFile={(file) => {
              reset();
              upload(file, {
                onSuccess: () => setShowUpload(false),
              });
            }}
            onSelectionChange={() => {
              if (error) reset();
            }}
            loading={isPending}
          />
          <StatementDownloadSteps className="mt-4" finalStep="Upload the PDF above" />
        </div>
      )}

      {isLoading || isPending || (isFetching && !!uploadResult) ? (
        <SkeletonCard height="h-64" />
      ) : !statements?.length ? (
        <EmptyState
          icon="description"
          title="No statements yet"
          description="Upload your first MoMo statement to start tracking your finances."
          action={
            <button
              type="button"
              onClick={() => {
                setUploadKey((k) => k + 1);
                setShowUpload(true);
              }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-body-sm font-medium"
            >
              Upload statement
            </button>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low dark:bg-dark-surface-alt">
                  {['Period', 'Transactions', 'Spent', 'Received', 'Net', 'Fees', 'E-levy', 'Uploaded', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="py-3 px-4 text-left text-label text-outline dark:text-dark-muted
                                           uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {statements.map((stmt) => (
                  <tr
                    key={stmt.id}
                    className="border-b border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.04)]
                                 hover:bg-surface-container-low dark:hover:bg-dark-surface-alt transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">
                        {formatPeriod(stmt.periodStart)}
                      </p>
                      <p className="text-body-sm text-outline dark:text-dark-muted">
                        {formatDate(stmt.periodStart)} – {formatDate(stmt.periodEnd)}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-on-surface dark:text-dark-text">—</td>
                    <td className="py-3 px-4 text-body-sm text-error font-medium">{formatGHS(stmt.totalDebit)}</td>
                    <td className="py-3 px-4 text-body-sm text-primary dark:text-inverse-primary font-medium">
                      {formatGHS(stmt.totalCredit)}
                    </td>
                    <td className="py-3 px-4 text-body-sm font-medium">
                      <span
                        className={
                          parseFloat(stmt.totalCredit) >= parseFloat(stmt.totalDebit)
                            ? 'text-primary dark:text-inverse-primary'
                            : 'text-error'
                        }
                      >
                        {formatGHS(parseFloat(stmt.totalCredit) - parseFloat(stmt.totalDebit))}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-[#EF9F27]">{formatGHS(stmt.totalFees)}</td>
                    <td className="py-3 px-4 text-body-sm text-[#EF9F27]">{formatGHS(stmt.totalELevy)}</td>
                    <td className="py-3 px-4 text-body-sm text-outline dark:text-dark-muted">
                      {formatDate(stmt.uploadedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/dashboard?statementId=${stmt.id}`}
                        className="text-primary dark:text-inverse-primary text-body-sm font-medium hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.06)]">
            {statements.map((stmt) => (
              <div key={stmt.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-body-mid font-semibold text-on-surface dark:text-dark-text">
                    {formatPeriod(stmt.periodStart)}
                  </p>
                  <Link
                    to={`/dashboard?statementId=${stmt.id}`}
                    className="text-primary dark:text-inverse-primary text-body-sm font-medium"
                  >
                    View →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-label text-outline dark:text-dark-muted">Spent</p>
                    <p className="text-body-sm text-error font-medium">{formatGHS(stmt.totalDebit)}</p>
                  </div>
                  <div>
                    <p className="text-label text-outline dark:text-dark-muted">Received</p>
                    <p className="text-body-sm text-primary dark:text-inverse-primary font-medium">
                      {formatGHS(stmt.totalCredit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-label text-outline dark:text-dark-muted">Fees</p>
                    <p className="text-body-sm text-[#EF9F27] font-medium">{formatGHS(stmt.totalFees)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
