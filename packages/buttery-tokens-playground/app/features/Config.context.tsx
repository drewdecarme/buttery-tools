import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";
import { ConfigSchema } from "@buttery/tokens-utils/schemas";
import type { FC, ReactNode } from "react";
import { useContext, useMemo, createContext, useCallback } from "react";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

import type {
  ConfigurationStateColor,
  ConfigurationStateSizeAndSpace,
} from "./config.utils";
import {
  getInitColorStateFromConfig,
  getInitSizeFromConfig,
  transformColorStateIntoColorConfig,
  transformSizeStateIntoColorConfig,
} from "./config.utils";

export type ConfigurationContextType = {
  color: ConfigurationStateColor;
  setColor: Updater<ConfigurationStateColor>;
  sizeAndSpace: ConfigurationStateSizeAndSpace;
  setSizeAndSpace: Updater<ConfigurationStateSizeAndSpace>;
  getConfigFromState: () => ButteryTokensConfig;
  originalConfig: ButteryTokensConfig;
};
const ConfigurationContext = createContext<ConfigurationContextType | null>(
  null
);
export type ConfigurationProviderProps = {
  children: ReactNode;
  originalConfig: ButteryTokensConfig;
};

export const ConfigurationProvider: FC<ConfigurationProviderProps> = ({
  children,
  originalConfig,
}) => {
  // Start setting initial state
  const [color, setColor] = useImmer(
    getInitColorStateFromConfig(originalConfig)
  );
  const [sizeAndSpace, setSizeAndSpace] = useImmer(
    getInitSizeFromConfig(originalConfig)
  );

  const getConfigFromState = useCallback<
    ConfigurationContextType["getConfigFromState"]
  >(() => {
    const configColor = transformColorStateIntoColorConfig(color);
    const configSizeAndSpace = transformSizeStateIntoColorConfig(sizeAndSpace);
    const config = ConfigSchema.safeParse({
      color: configColor,
      sizeAndSpace: configSizeAndSpace,
    });
    if (config.error) {
      throw config.error;
    }
    return config.data;
  }, [color, sizeAndSpace]);

  const value = useMemo<ConfigurationContextType>(
    () => ({
      color,
      setColor,
      sizeAndSpace,
      setSizeAndSpace,
      getConfigFromState,
      originalConfig,
    }),
    [
      color,
      getConfigFromState,
      originalConfig,
      setColor,
      setSizeAndSpace,
      sizeAndSpace,
    ]
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

// const config = ConfigSchema.parse({
//   runtime: {
//     namespace: "testing",
//     prefix: "testing",
//   },
//   gridSystem: 4,
//   color: {
//     brand: {
//       type: "manual",
//       colors: {
//         primary: {
//           hex: "#29cbe0",
//           variants: 10,
//         },
//         blue: {
//           hex: "#2651ac",
//           variants: 10,
//         },
//         secondary: {
//           hex: "#a236c9",
//           variants: 4,
//         },
//         third: {
//           hex: "#367bc9",
//           variants: 10,
//         },
//         // scrolling
//         primary2: {
//           hex: "#29cbe0",
//           variants: 10,
//         },
//         blue2: {
//           hex: "#2651ac",
//           variants: 10,
//         },
//         secondary2: {
//           hex: "#a236c9",
//           variants: 4,
//         },
//         third2: {
//           hex: "#367bc9",
//           variants: 10,
//         },
//         brand: {
//           hex: "#326768",
//           variants: {
//             light: "#4da6a8",
//             medium: "#1f3f3f",
//             dark: "#142a2a",
//           },
//         },
//         success: {
//           hex: "#44b430",
//           variants: 3,
//         },
//         warning: {
//           hex: "#d9d43c",
//           variants: 3,
//         },
//         danger: {
//           hex: "#d9513c",
//           variants: 3,
//         },
//         success2: {
//           hex: "#44b430",
//           variants: 3,
//         },
//         warning2: {
//           hex: "#d9d43c",
//           variants: 3,
//         },
//         danger2: {
//           hex: "#d9513c",
//           variants: 3,
//         },
//       },
//     },
//     neutral: {
//       base: "#ccc",
//       "grey-2": "#ddd",
//     },
//   },
//   breakpoints: {},
//   custom: {},
//   font: {},
// } as ButteryTokensConfig);
