import { useEffect, useState } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";

export function PromoBanner() {
  const { enabled, loading } = useFeatureFlag("promo-banner");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (enabled) {
      setDismissed(false);
    }
  }, [enabled]);

  if (loading || !enabled || dismissed) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <svg
          className="h-4 w-4 animate-bounce"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        </svg>
        <span>
          Spring Sale — Use code{" "}
          <code className="rounded bg-white/20 px-1.5 py-0.5 font-bold tracking-wider">
            LAUNCH20
          </code>{" "}
          for 20% off your entire order!
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/20"
        aria-label="Dismiss banner"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
