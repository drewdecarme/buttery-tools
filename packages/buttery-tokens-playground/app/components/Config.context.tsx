import { ConfigSchema } from "@buttery/tokens-utils/schemas";
import type { FC, ReactNode } from "react";
import { useRef, useContext, useMemo, createContext } from "react";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

import type { ConfigurationStateColor } from "./config.utils";
import { getInitColorStateFromConfig } from "./config.utils";

export type ConfigurationContextType = {
  color: ConfigurationStateColor;
  setColor: Updater<ConfigurationStateColor>;
};
const ConfigurationContext = createContext<ConfigurationContextType | null>(
  null
);
export type ConfigurationProviderProps = {
  children: ReactNode;
};

const config = ConfigSchema.parse({});

export const ConfigurationProvider: FC<ConfigurationProviderProps> = ({
  children,
}) => {
  // color transforms & state
  const initColorRef = useRef(getInitColorStateFromConfig(config));
  const [color, setColor] = useImmer(initColorRef.current);

  const value = useMemo<ConfigurationContextType>(
    () => ({ color, setColor }),
    [color, setColor]
  );

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfigurationContext = (): ConfigurationContextType => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "'useConfigurationContext()' must be used within a <ConfigurationProvider /> component"
    );
  }
  return context;
};
