import { useContext } from "react";
import { MenuContext, type MenuContextType } from "./Menu.context";

export const useMenuContext = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error(
      "'useMenuContext()' must be used within a <MenuProvider /> component"
    );
  }
  return context;
};
