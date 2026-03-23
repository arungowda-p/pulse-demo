import { type ReactNode } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useDark } from "../context/DarkContext";

export function FeatureShowcase({
  flagKey,
  title,
  description,
  icon,
}: {
  flagKey: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  const dark = useDark();
  const { enabled, loading } = useFeatureFlag(flagKey);

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-colors ${
        dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
            enabled
              ? "bg-emerald-100 text-emerald-600"
              : dark
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-semibold ${dark ? "text-gray-200" : "text-gray-900"}`}
            >
              {title}
            </h3>
            {!loading && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  enabled
                    ? "bg-emerald-50 text-emerald-700"
                    : dark
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {enabled ? "ON" : "OFF"}
              </span>
            )}
          </div>
          <p
            className={`mt-1 text-xs leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
