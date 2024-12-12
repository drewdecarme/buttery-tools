import {
  type ButteryTokensConfigFontWellFormed,
  type ButteryTokensConfigColorBrandTypeManual,
  type ButteryTokensConfigColorBrandTypeAuto,
} from "@buttery/tokens-utils/schemas";
import type { FC, ReactNode } from "react";
import { useRef, useContext, useMemo, createContext } from "react";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

import {
  initConfig,
  initConfigColorAuto,
  initConfigColorManual,
} from "./config.utils";

type ConfigurationContextTypePersisted = {
  color: {
    brand: {
      auto: ButteryTokensConfigColorBrandTypeAuto;
      manual: ButteryTokensConfigColorBrandTypeManual;
    };
  };
};
type ConfigurationContextType = {
  config: ButteryTokensConfigFontWellFormed;
  setConfig: Updater<ButteryTokensConfigFontWellFormed>;
  persistedRef: React.MutableRefObject<ConfigurationContextTypePersisted>;
};
const ConfigurationContext = createContext<ConfigurationContextType | null>(
  null
);
export type ConfigurationProviderProps = {
  children: ReactNode;
};

export const ConfigurationProvider: FC<ConfigurationProviderProps> = ({
  children,
}) => {
  const [config, setConfig] =
    useImmer<ButteryTokensConfigFontWellFormed>(initConfig);
  const persistedRef = useRef<ConfigurationContextTypePersisted>({
    color: {
      brand: {
        auto: initConfigColorAuto,
        manual: initConfigColorManual,
      },
    },
  });

  const value = useMemo<ConfigurationContextType>(
    () => ({ config, setConfig, persistedRef }),
    [config, persistedRef]
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
