import { type PulseConfig } from "../hooks/usePulseConfig";
import { useDark } from "../context/DarkContext";

export function ConfigSelector({
  config,
  onChange,
}: {
  config: PulseConfig;
  onChange: (config: PulseConfig) => void;
}) {
  const dark = useDark();
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    dark
      ? "border-gray-600 bg-gray-700 text-gray-100"
      : "border-gray-300 bg-white text-gray-900"
  }`;
  const labelClass = `mb-1 block text-xs font-semibold uppercase tracking-wider ${
    dark ? "text-gray-400" : "text-gray-500"
  }`;

  return (
    <div
      className={`mb-8 rounded-xl border p-4 shadow-sm transition-colors ${
        dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className={labelClass}>Project</label>
          <input
            type="text"
            value={config.projectSlug}
            onChange={(event) =>
              onChange({ ...config, projectSlug: event.target.value })
            }
            placeholder="pulse-demo"
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass}>
            Environment
            <span
              className={`ml-1.5 font-normal normal-case ${dark ? "text-gray-500" : "text-gray-400"}`}
            >
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={config.environmentId ?? ""}
            onChange={(event) =>
              onChange({
                ...config,
                environmentId: event.target.value || null,
                clientId: null,
              })
            }
            placeholder="environment id (optional)"
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass}>
            Client
            <span
              className={`ml-1.5 font-normal normal-case ${dark ? "text-gray-500" : "text-gray-400"}`}
            >
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={config.clientId ?? ""}
            onChange={(event) =>
              onChange({ ...config, clientId: event.target.value || null })
            }
            placeholder="client id (optional)"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
