import { useEffect, useState, useCallback, useRef } from 'react';
import { usePulseConfig } from './usePulseConfig';

const API_BASE = '/api';

interface UseFlagResult {
  enabled: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFeatureFlag(flagKey: string): UseFlagResult {
  const { projectSlug, environmentId, clientId } = usePulseConfig();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const evaluate = useCallback(async () => {
    if (!projectSlug) {
      setLoading(false);
      return;
    }

    const isInitial = !initializedRef.current;
    if (isInitial) {
      setLoading(true);
    }
    setError(null);
    try {
      const params = new URLSearchParams();
      if (environmentId) params.set('environmentId', environmentId);
      if (clientId) params.set('clientId', clientId);
      const qs = params.toString();
      const url = `${API_BASE}/eval/${projectSlug}/${flagKey}${qs ? `?${qs}` : ''}`;

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          setEnabled((prev) => (prev !== false ? false : prev));
          return;
        }
        throw new Error(`Flag evaluation failed (${res.status})`);
      }
      const data = await res.json();
      const newValue = !!data.on;
      setEnabled((prev) => (prev !== newValue ? newValue : prev));
    } catch (e) {
      setError((e as Error).message);
      setEnabled((prev) => (prev !== false ? false : prev));
    } finally {
      if (isInitial) {
        initializedRef.current = true;
      }
      setLoading(false);
    }
  }, [flagKey, projectSlug, environmentId, clientId]);

  useEffect(() => {
    initializedRef.current = false;
    evaluate();
    const interval = setInterval(evaluate, 5000);
    return () => clearInterval(interval);
  }, [evaluate]);

  return { enabled, loading, error, refresh: evaluate };
}
