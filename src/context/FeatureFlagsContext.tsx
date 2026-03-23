import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

interface StreamFlag {
  key: string;
  on: boolean;
  overrides?: { clientId: string; on: boolean }[];
  envOverrides?: { environmentId: string; on: boolean }[];
}

interface StreamPayload {
  projectSlug: string;
  ts: number;
  flags: StreamFlag[];
}

function resolveFlag(flag: StreamFlag, config: PulseConfig): boolean {
  if (config.clientId) {
    const clientOverride = (flag.overrides ?? []).find(
      (override) => override.clientId === config.clientId,
    );
    if (clientOverride) return clientOverride.on;
  }

  if (config.environmentId) {
    const envOverride = (flag.envOverrides ?? []).find(
      (override) => override.environmentId === config.environmentId,
    );
    if (envOverride) return envOverride.on;
  }

  return flag.on;
}

export function FeatureFlagsProvider({
  config,
  children,
}: {
  config: PulseConfig;
  children: ReactNode;
}) {
  const projectSlug = config.projectSlug || "pulse-demo";
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshSeq = useRef(0);

  const fetchLatest = useCallback(async () => {
    const params = new URLSearchParams();
    if (config.environmentId) params.set("environmentId", config.environmentId);
    if (config.clientId) params.set("clientId", config.clientId);
    const query = params.toString();
    const url = `/api/eval/${encodeURIComponent(projectSlug)}${query ? `?${query}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch flags (${response.status})`);
    const payload = (await response.json()) as { flags?: Record<string, boolean> };
    return payload.flags ?? {};
  }, [projectSlug, config.environmentId, config.clientId]);

  const refresh = useCallback(async () => {
    const currentSeq = ++refreshSeq.current;
    try {
      setError(null);
      const nextFlags = await fetchLatest();
      if (currentSeq !== refreshSeq.current) return;
      setFlags(nextFlags);
    } catch (e) {
      if (currentSeq !== refreshSeq.current) return;
      setError((e as Error).message || "Failed to refresh flags");
    } finally {
      if (currentSeq !== refreshSeq.current) return;
      setLoading(false);
    }
  }, [fetchLatest]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    void (async () => {
      await refresh();
    })();

    const source = new EventSource(`/api/stream/${encodeURIComponent(projectSlug)}`);
    source.onmessage = (event) => {
      if (cancelled) return;
      try {
        const payload = JSON.parse(event.data) as StreamPayload;
        if (payload.projectSlug !== projectSlug || !Array.isArray(payload.flags)) return;
        const next: Record<string, boolean> = {};
        for (const flag of payload.flags) {
          if (flag?.key) {
            next[flag.key] = resolveFlag(flag, config);
          }
        }
        // Any stream event supersedes older refresh responses.
        refreshSeq.current++;
        setError(null);
        setFlags(next);
        setLoading(false);
      } catch (e) {
        setError((e as Error).message || "Failed to parse stream payload");
      }
    };

    source.onerror = () => {
      if (cancelled) return;
      // EventSource reconnects automatically; only resync once it is back.
      source.onopen = () => {
        if (cancelled) return;
        try {
          void refresh();
        } finally {
          source.onopen = null;
        }
      };
    };

    return () => {
      cancelled = true;
      source.close();
    };
  }, [config, projectSlug, refresh]);

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
