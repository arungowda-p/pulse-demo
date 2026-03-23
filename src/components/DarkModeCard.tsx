import { useDark } from "../context/DarkContext";

export function DarkModeCard() {
  const dark = useDark();

  return (
    <section className="mb-10">
      <h2
        className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
      >
        Live Feature Demo —{" "}
        <code className="normal-case text-indigo-500">dark-mode</code>
      </h2>
      <div
        className={`rounded-xl border p-6 shadow-sm transition-colors ${
          dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
              dark ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            {dark ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            )}
          </div>
          <div>
            <p
              className={`text-base font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}
            >
              {dark ? "Dark Mode Active" : "Light Mode Active"}
            </p>
            <p className={`mt-0.5 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {dark
                ? "The entire page has switched to a dark theme. Turn off the flag to revert."
                : "Turn on the dark-mode flag in the Dashboard to see the entire page switch to a dark theme."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
