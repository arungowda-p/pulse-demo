import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useDark } from "../context/DarkContext";
import { ALL_FLAGS, type FlagDef } from "../constants/demoData";
import { IconRefresh } from "./icons";

function FlagRow({ def }: { def: FlagDef }) {
  const dark = useDark();
  const { enabled, loading, error, refresh } = useFeatureFlag(def.key);

  return (
    <tr
      className={`border-b last:border-b-0 transition-colors ${
        dark
          ? "border-gray-700 hover:bg-gray-700/50"
          : "border-gray-100 hover:bg-gray-50/60"
      }`}
    >
      <td className="px-5 py-4">
        <code
          className={`rounded px-2 py-1 font-mono text-xs font-medium ${
            dark
              ? "bg-indigo-500/20 text-indigo-300"
              : "bg-indigo-50 text-indigo-700"
          }`}
        >
          {def.key}
        </code>
      </td>
      <td className="px-5 py-4">
        <div
          className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-900"}`}
        >
          {def.label}
        </div>
        <div
          className={`mt-0.5 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          {def.description}
        </div>
      </td>
      <td className="px-5 py-4 text-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            loading
              ? dark
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-yellow-50 text-yellow-700"
              : error
                ? dark
                  ? "bg-red-500/20 text-red-300"
                  : "bg-red-50 text-red-700"
                : enabled
                  ? dark
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-emerald-50 text-emerald-700"
                  : dark
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              loading
                ? "animate-pulse bg-yellow-500"
                : error
                  ? "bg-red-500"
                  : enabled
                    ? "bg-emerald-500"
                    : "bg-gray-400"
            }`}
          />
          {loading ? "Loading" : error ? "Error" : enabled ? "ON" : "OFF"}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <button
          onClick={refresh}
          className={`rounded-lg p-2 transition-colors ${
            dark
              ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          }`}
          title="Refresh flag"
        >
          <IconRefresh />
        </button>
      </td>
    </tr>
  );
}

export function FlagStatusTable() {
  const dark = useDark();
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm transition-colors ${
        dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr
            className={`border-b ${dark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50/80"}`}
          >
            <th
              className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Key
            </th>
            <th
              className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Feature
            </th>
            <th
              className={`px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Status
            </th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {ALL_FLAGS.map((f) => (
            <FlagRow key={f.key} def={f} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
