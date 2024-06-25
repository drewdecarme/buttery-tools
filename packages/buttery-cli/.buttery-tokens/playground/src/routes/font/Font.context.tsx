import React from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";

type FontContextType = {
  sample: string;
};
const FontContext = React.createContext<FontContextType | null>(null);
export type FontProviderProps = {
  children: ReactNode;
};
export const FontProvider: FC<FontProviderProps> = ({ children }) => {
  const value = useMemo(
    () => ({
      sample: "sample",
    }),
    []
  );

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};

export const useFontContext = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error(
      "'useFontContext()' must be used within a <FontProvider /> component"
    );
  }
  return context;
};
