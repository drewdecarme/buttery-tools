import {
  type SetStateAction,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import React, { useState } from "react";

export type ColorPreviewThemeMode = "light" | "dark";
type ColorPreviewContextType = {
  themeMode: ColorPreviewThemeMode;
  setThemeMode: React.Dispatch<SetStateAction<ColorPreviewThemeMode>>;
};
const ColorPreviewContext = React.createContext<ColorPreviewContextType | null>(
  null
);
export type ColorPreviewProviderProps = {
  children: ReactNode;
};
export const ColorPreviewProvider: FC<ColorPreviewProviderProps> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ColorPreviewThemeMode>("light");

  const value = useMemo<ColorPreviewContextType>(
    () => ({
      themeMode,
      setThemeMode,
    }),
    [themeMode]
  );

  return (
    <ColorPreviewContext.Provider value={value}>
      {children}
    </ColorPreviewContext.Provider>
  );
};

export const useColorPreviewContext = (): ColorPreviewContextType => {
  const context = useContext(ColorPreviewContext);
  if (!context) {
    throw new Error(
      "'useColorPreviewContext()' must be used within a <ColorPreviewProvider /> component"
    );
  }
  return context;
};
