import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";
import { ConfigSchema } from "@buttery/tokens-utils/schemas";
import type { FC, ReactNode } from "react";
import { useRef, useContext, useMemo, createContext, useCallback } from "react";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

import type { ConfigurationStateColor } from "./config.utils";
import {
  getInitColorStateFromConfig,
  transformColorStateIntoColorConfig,
} from "./config.utils";

export type ConfigurationContextType = {
  color: ConfigurationStateColor;
  setColor: Updater<ConfigurationStateColor>;
  getConfig: () => ButteryTokensConfig;
};
const ConfigurationContext = createContext<ConfigurationContextType | null>(
  null
);
export type ConfigurationProviderProps = {
  children: ReactNode;
};

const config = ConfigSchema.parse({
  runtime: {
    namespace: "testing",
    prefix: "testing",
  },
  gridSystem: 4,
  color: {
    brand: {
      type: "manual",
      colors: {
        primary: {
          hex: "#29cbe0",
          variants: 10,
        },
        blue: {
          hex: "#2651ac",
          variants: 10,
        },
        secondary: {
          hex: "#a236c9",
          variants: 4,
        },
        third: {
          hex: "#367bc9",
          variants: 10,
        },
        // scrolling
        primary2: {
          hex: "#29cbe0",
          variants: 10,
        },
        blue2: {
          hex: "#2651ac",
          variants: 10,
        },
        secondary2: {
          hex: "#a236c9",
          variants: 4,
        },
        third2: {
          hex: "#367bc9",
          variants: 10,
        },
        brand: {
          hex: "#326768",
          variants: {
            light: "#4da6a8",
            medium: "#1f3f3f",
            dark: "#142a2a",
          },
        },
        success: {
          hex: "#44b430",
          variants: 3,
        },
        warning: {
          hex: "#d9d43c",
          variants: 3,
        },
        danger: {
          hex: "#d9513c",
          variants: 3,
        },
        success2: {
          hex: "#44b430",
          variants: 3,
        },
        warning2: {
          hex: "#d9d43c",
          variants: 3,
        },
        danger2: {
          hex: "#d9513c",
          variants: 3,
        },
      },
    },
    neutral: {
      base: "#ccc",
      "grey-2": "#ddd",
    },
  },
  breakpoints: {},
  custom: {},
  font: {},
} as ButteryTokensConfig);

export const ConfigurationProvider: FC<ConfigurationProviderProps> = ({
  children,
}) => {
  // color transforms & state
  const initColorRef = useRef(getInitColorStateFromConfig(config));
  const [color, setColor] = useImmer(initColorRef.current);

  const getConfig = useCallback(() => {
    const configColor = transformColorStateIntoColorConfig(color);
    const config = ConfigSchema.safeParse({
      color: configColor,
    });
    if (config.error) {
      throw config.error;
    }
    return config.data;
  }, [color]);

  const value = useMemo<ConfigurationContextType>(
    () => ({ color, setColor, getConfig }),
    [color, getConfig, setColor]
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
