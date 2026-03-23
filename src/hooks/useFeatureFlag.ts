import { useFeatureFlagsContext } from "../context/FeatureFlagsContext";

interface UseFlagResult {
  enabled: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFeatureFlag(flagKey: string): UseFlagResult {
  const { flags, loading, error, refresh } = useFeatureFlagsContext();
  const value = flagKey in flags ? flags[flagKey] : false;

  return {
    enabled: value,
    loading,
    error,
    refresh: () => {
      void refresh();
    },
  };
}
