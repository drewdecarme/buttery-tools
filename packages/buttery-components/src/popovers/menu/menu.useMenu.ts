import { useCallback, useMemo, useRef } from "react";
import type { MenuRef } from "./menu.utils";

export const useMenu = <T extends HTMLElement = HTMLElement>() => {
  const menuRef = useRef<MenuRef | null>(null);
  const targetRef = useRef<T | null>(null);

  const openMenu = useCallback(() => {
    menuRef.current?.handleOpen();
  }, []);

  const closeMenu = useCallback(() => {
    menuRef.current?.handleClose();
  }, []);

  return useMemo(
    () => ({
      menuRef,
      targetRef,
      openMenu,
      closeMenu,
    }),
    [openMenu, closeMenu]
  );
};
