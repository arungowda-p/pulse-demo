import { useFeatureFlag } from "../hooks/useFeatureFlag";

export function MaintenanceOverlay() {
  const { enabled, loading } = useFeatureFlag("maintenance-mode");
  if (loading || !enabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.867 19.125h.008v.008h-.008v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Under Maintenance</h2>
        <p className="mt-2 text-sm text-gray-500">
          We're performing scheduled maintenance to improve your experience.
          Please check back shortly.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          Maintenance in progress
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-500">
          Controlled by{" "}
          <code className="font-semibold text-indigo-600">maintenance-mode</code>{" "}
          flag
        </div>
      </div>
    </div>
  );
}
