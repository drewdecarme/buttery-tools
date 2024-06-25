import type { ButteryTokensColor } from "@buttery/core";
import React, {
  type FC,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { generatedTokens } from "../../tokens/tokens-generated";

type ColorContextType = {
  state: ButteryTokensColor;
  setState: React.Dispatch<React.SetStateAction<ButteryTokensColor>>;
};
const ColorContext = React.createContext<ColorContextType | null>(null);
export type ColorProviderProps = {
  children: ReactNode;
};
export const ColorProvider: FC<ColorProviderProps> = ({ children }) => {
  const [state, setState] = useState<ButteryTokensColor>(
    generatedTokens.config.color as ButteryTokensColor
  );

  return (
    <ColorContext.Provider
      value={useMemo(() => ({ state, setState }), [state])}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error(
      "'useColorContext()' must be used within a <ColorProvider /> component"
    );
  }
  return context;
};
