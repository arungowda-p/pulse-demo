import { createContext, useContext, type ReactNode } from "react";
import { usePulseFlags } from "@pulse/sdk/react";
import { type PulseConfig } from "../hooks/usePulseConfig";

interface FeatureFlagsContextValue {
  flags: Record<string, boolean>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const FeatureFlagsCtx = createContext<FeatureFlagsContextValue>({
  flags: {},
  loading: true,
  error: null,
  refresh: () => {},
});

export function FeatureFlagsProvider({
  config,
  children,
}: {
  config: PulseConfig;
  children: ReactNode;
}) {
  const { flags, loading, error, refresh } = usePulseFlags({
    baseUrl: "",
    projectSlug: config.projectSlug || "pulse-demo",
    context: {
      environmentId: config.environmentId ?? undefined,
      clientId: config.clientId ?? undefined,
    },
    defaultValue: false,
  });

  return (
    <FeatureFlagsCtx.Provider
      value={{
        flags,
        loading,
        error,
        refresh: () => {
          void refresh();
        },
      }}
    >
      {children}
    </FeatureFlagsCtx.Provider>
  );
}

export function useFeatureFlagsContext() {
  return useContext(FeatureFlagsCtx);
}
