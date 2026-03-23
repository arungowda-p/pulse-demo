import { PulseConfigCtx, type PulseConfig } from "./hooks/usePulseConfig";
import { useEffect, useState } from "react";
import { DemoPageContent } from "./components/DemoPageContent";
import { FeatureFlagsProvider } from "./context/FeatureFlagsContext";

export default function App() {
  const [config, setConfig] = useState<PulseConfig>(() => {
    try {
      const saved = localStorage.getItem("pulse-demo-config");
      if (saved) {
        const parsed = JSON.parse(saved) as PulseConfig;
        return {
          ...parsed,
          projectSlug:
            parsed.projectSlug && parsed.projectSlug.trim() !== ""
              ? parsed.projectSlug === "pulse"
                ? "pulse-demo"
                : parsed.projectSlug
              : "pulse-demo",
        };
      }
    } catch {
      /* ignore */
    }
    return { projectSlug: "pulse-demo", environmentId: null, clientId: null };
  });

  useEffect(() => {
    localStorage.setItem("pulse-demo-config", JSON.stringify(config));
  }, [config]);

  return (
    <PulseConfigCtx.Provider value={config}>
      <FeatureFlagsProvider config={config}>
        <DemoPageContent config={config} onConfigChange={setConfig} />
      </FeatureFlagsProvider>
    </PulseConfigCtx.Provider>
  );
}
