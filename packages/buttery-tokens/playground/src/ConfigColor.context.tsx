import type { ButteryTokensColor } from "@buttery/core";
import React, {
  type FC,
  type ReactNode,
  useContext,
  useMemo,
  useState
} from "react";
import { generatedTokens } from "./tokens-generated";

type ConfigColorContextType = {
  state: ButteryTokensColor;
  setState: React.Dispatch<React.SetStateAction<ButteryTokensColor>>;
};
const ConfigColorContext = React.createContext<ConfigColorContextType | null>(
  null
);
export type ConfigColorProviderProps = {
  children: ReactNode;
};
export const ConfigColorProvider: FC<ConfigColorProviderProps> = ({
  children
}) => {
  const [state, setState] = useState<ButteryTokensColor>(
    generatedTokens.config.color as ButteryTokensColor
  );

  return (
    <ConfigColorContext.Provider
      value={useMemo(() => ({ state, setState }), [state])}
    >
      {children}
    </ConfigColorContext.Provider>
  );
};

export const useConfigColorContext = (): ConfigColorContextType => {
  const context = useContext(ConfigColorContext);
  if (!context) {
    throw new Error(
      "'useConfigColorContext()' must be used within a <ConfigColorProvider /> component"
    );
  }
  return context;
};
