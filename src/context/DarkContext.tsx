import { createContext, useContext, type ReactNode } from "react";

const DarkCtx = createContext(false);

export function DarkModeProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return <DarkCtx.Provider value={enabled}>{children}</DarkCtx.Provider>;
}

export function useDark() {
  return useContext(DarkCtx);
}
