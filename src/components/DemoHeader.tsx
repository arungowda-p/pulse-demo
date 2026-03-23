import { IconFlag, IconLink } from "./icons";
import { useDark } from "../context/DarkContext";

const DASHBOARD_URL = "http://localhost:4000";

export function DemoHeader() {
  const dark = useDark();

  return (
    <div className="mb-10 text-center">
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg ${
          dark ? "shadow-indigo-500/20" : "shadow-indigo-200"
        }`}
      >
        <IconFlag />
      </div>
      <h1
        className={`text-3xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
      >
        Pulse Demo
      </h1>
      <p className={`mt-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        A standalone consumer app showing how feature flags control UI in real
        time.
      </p>
      <a
        href={DASHBOARD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-400"
      >
        Open Dashboard <IconLink />
      </a>
    </div>
  );
}
