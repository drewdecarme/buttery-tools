import { useCallback, useId, useMemo, useRef } from "react";
import type { DropdownOptions, DropdownRef } from "../useDropdown";

export const useDropdownMenu = (options?: Omit<DropdownOptions, "id">) => {
  const id = useId();
  const dropdownMenuRef = useRef<DropdownRef | null>(null);

  const openMenu = useCallback(() => {
    dropdownMenuRef.current?.handleOpen(undefined, { id, ...options });
  }, [options, id]);

  const closeMenu = useCallback(() => {
    dropdownMenuRef.current?.handleClose();
  }, []);

  const toggleMenu = useCallback(() => {
    dropdownMenuRef.current?.handleToggle(undefined, { id, ...options });
  }, [options, id]);

  const handleTargetKeyDown = useCallback<
    Required<JSX.IntrinsicElements["button"]>["onKeyDown"]
  >(
    (e) => {
      switch (e.key) {
        case "Enter":
        case " ": // space
          e.preventDefault(); // prevent the click event from also firing
          toggleMenu();
          break;

        default:
          break;
      }
    },
    [toggleMenu]
  );

  const targetProps = useMemo<JSX.IntrinsicElements["button"]>(() => {
    return {
      type: "button",
      "aria-expanded": false,
      "aria-controls": id,
      onKeyDown: handleTargetKeyDown,
      onClick: toggleMenu
    };
  }, [handleTargetKeyDown, id, toggleMenu]);

  const dropdownProps = useMemo<{
    options: DropdownOptions;
    ref: typeof dropdownMenuRef;
  }>(
    () => ({
      options: { id, ...options },
      ref: dropdownMenuRef
    }),
    [options, id]
  );

  return useMemo(
    () => ({
      targetProps,
      dropdownProps,
      openMenu,
      closeMenu,
      toggleMenu
    }),
    [openMenu, closeMenu, toggleMenu, targetProps, dropdownProps]
  );
};
