import React from "react";
import { type FC, type ReactNode, useMemo } from "react";

export type MenuContextType = {
  closeMenu: () => Promise<void>;
};
export const MenuContext = React.createContext<MenuContextType | null>(null);
export type MenuProviderProps = {
  closeMenu: () => Promise<void>;
  children: ReactNode;
};
export const MenuProvider: FC<MenuProviderProps> = ({
  closeMenu,
  children,
}) => {
  const value = useMemo(
    () => ({
      closeMenu,
    }),
    [closeMenu]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
