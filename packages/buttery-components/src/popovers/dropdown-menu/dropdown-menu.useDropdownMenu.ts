import { useCallback, useMemo, useRef } from "react";
import type { DropdownOptions, DropdownRef } from "../../hooks";

export const useDropdownMenu = <T extends HTMLElement = HTMLElement>(
  options?: DropdownOptions
) => {
  const menuRef = useRef<DropdownRef | null>(null);
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
