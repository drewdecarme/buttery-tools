import React from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";

type InputSelectDropdownContextType = {
  onSelect: (value: string) => void;
};
const InputSelectDropdownContext =
  React.createContext<InputSelectDropdownContextType | null>(null);
export type InputSelectDropdownProviderProps = {
  children: ReactNode;
  onSelect: (value: string) => void;
};
export const InputSelectDropdownProvider: FC<
  InputSelectDropdownProviderProps
> = ({ children, onSelect }) => {
  const value = useMemo(
    () => ({
      onSelect,
    }),
    [onSelect]
  );

  return (
    <InputSelectDropdownContext.Provider value={value}>
      {children}
    </InputSelectDropdownContext.Provider>
  );
};

export const useInputSelectDropdownContext =
  (): InputSelectDropdownContextType => {
    const context = useContext(InputSelectDropdownContext);
    if (!context) {
      throw new Error(
        "'useInputSelectDropdownContext()' must be used within a <InputSelectDropdownProvider /> component"
      );
    }
    return context;
  };
