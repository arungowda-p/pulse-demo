import { createContext, useContext } from "react";

export interface PulseConfig {
  projectSlug: string;
  environmentId: string | null;
  clientId: string | null;
}

export const PulseConfigCtx = createContext<PulseConfig>({
  projectSlug: "pulse-demo",
  environmentId: null,
  clientId: null,
});

export const usePulseConfig = () => useContext(PulseConfigCtx);
