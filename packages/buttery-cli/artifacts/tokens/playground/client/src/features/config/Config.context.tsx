import type { ButteryConfigTokens } from "@buttery/core";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";

type ConfigContextType = {
  liveConfig: ButteryConfigTokens;
  setLiveConfig: Dispatch<SetStateAction<ButteryConfigTokens>>;
};
const ConfigContext = React.createContext<ConfigContextType | null>(null);
export type ConfigProviderProps = {
  children: ReactNode;
  initConfig: ButteryConfigTokens;
};
export const ConfigProvider: FC<ConfigProviderProps> = ({
  children,
  initConfig,
}) => {
  const [liveConfig, setLiveConfig] = useState(initConfig);

  const value = useMemo(
    () => ({
      liveConfig,
      setLiveConfig,
    }),
    [liveConfig]
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfigContext = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(
      "'useConfigContext()' must be used within a <ConfigProvider /> component"
    );
  }
  return context;
};
