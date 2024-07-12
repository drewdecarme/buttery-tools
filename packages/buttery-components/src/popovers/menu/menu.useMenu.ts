import { useCallback, useMemo, useRef } from "react";
import type { MenuOptions, MenuRef } from "./menu.types";

export const useMenu = <T extends HTMLElement = HTMLElement>(
  options?: MenuOptions
) => {
  const menuRef = useRef<MenuRef | null>(null);
  const targetRef = useRef<T | null>(null);

  const openMenu = useCallback(() => {
    menuRef.current?.handleOpen(options);
  }, [options]);

  const closeMenu = useCallback(() => {
    menuRef.current?.handleClose();
  }, []);

  const toggleMenu = useCallback(() => {
    menuRef.current?.handleToggle(options);
  }, [options]);

  return useMemo(
    () => ({
      menuRef,
      targetRef,
      openMenu,
      closeMenu,
      toggleMenu,
    }),
    [openMenu, closeMenu, toggleMenu]
  );
};
