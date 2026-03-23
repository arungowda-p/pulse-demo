import { useDark } from "../context/DarkContext";

export function HowItWorksCard() {
  const dark = useDark();

  return (
    <section
      className={`rounded-xl border p-6 shadow-sm transition-colors ${
        dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <h2
        className={`text-base font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}
      >
        How it works
      </h2>
      <ol
        className={`mt-3 space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
      >
        {[
          <>
            Select a <strong>project</strong>, optional{" "}
            <strong>environment</strong>, and optional <strong>client</strong> to
            scope flag evaluation.
          </>,
          <>
            This app uses{" "}
            <code
              className={`rounded px-1.5 py-0.5 text-xs ${dark ? "bg-gray-700" : "bg-gray-100"}`}
            >
              @pulse/sdk/react
            </code>{" "}
            for all flag reads and updates.
          </>,
          <>
            The SDK maintains a stream connection and falls back to eval
            endpoints when needed, so UI updates stay near real-time.
          </>,
          <>
            Toggle a flag in the Dashboard and watch this page react — no
            redeploy needed. Switching environments or clients shows different
            flag values.
          </>,
        ].map((text, index) => (
          <li key={index} className="flex gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                dark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {index + 1}
            </span>
            {text}
          </li>
        ))}
      </ol>
    </section>
  );
}
