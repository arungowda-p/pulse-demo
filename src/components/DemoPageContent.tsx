import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { type PulseConfig } from "../hooks/usePulseConfig";
import { DarkModeProvider, useDark } from "../context/DarkContext";
import { ConfigSelector } from "./ConfigSelector";
import { PromoBanner } from "./PromoBanner";
import { MaintenanceOverlay } from "./MaintenanceOverlay";
import { DemoHeader } from "./DemoHeader";
import { FlagStatusTable } from "./FlagStatusTable";
import { CheckoutDemo } from "./CheckoutDemo";
import { DarkModeCard } from "./DarkModeCard";
import { FeatureShowcaseSection } from "./FeatureShowcaseSection";
import { HowItWorksCard } from "./HowItWorksCard";
import { FeedbackWidget } from "./FeedbackWidget";

function BodyContent({
  config,
  onConfigChange,
}: {
  config: PulseConfig;
  onConfigChange: (config: PulseConfig) => void;
}) {
  const dark = useDark();

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        dark
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-indigo-50/30"
      }`}
    >
      <PromoBanner />
      <MaintenanceOverlay />

      <div className="mx-auto max-w-2xl px-4 py-12">
        <DemoHeader />

        <section className="mb-10">
          <h2
            className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
          >
            Flag Status{" "}
            <span className={`font-normal ${dark ? "text-gray-600" : "text-gray-300"}`}>
              — updates live via SSE
            </span>
          </h2>
          <ConfigSelector config={config} onChange={onConfigChange} />
          <FlagStatusTable />
        </section>

        <section className="mb-10">
          <h2
            className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
          >
            Live Feature Demo —{" "}
            <code className="normal-case text-indigo-500">new-checkout</code>
          </h2>
          <CheckoutDemo />
        </section>

        <DarkModeCard />
        <FeatureShowcaseSection />
        <HowItWorksCard />

        <footer
          className={`mt-10 border-t pt-6 text-center text-xs ${
            dark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-400"
          }`}
        >
          Pulse Feature Flags — Demo App &middot; Connects to Dashboard API
        </footer>
      </div>

      <FeedbackWidget />
    </div>
  );
}

export function DemoPageContent({
  config,
  onConfigChange,
}: {
  config: PulseConfig;
  onConfigChange: (config: PulseConfig) => void;
}) {
  const { enabled: isDark, loading: darkLoading } = useFeatureFlag("dark-mode");
  const dark = !darkLoading && isDark;

  return (
    <DarkModeProvider enabled={dark}>
      <BodyContent config={config} onConfigChange={onConfigChange} />
    </DarkModeProvider>
  );
}
