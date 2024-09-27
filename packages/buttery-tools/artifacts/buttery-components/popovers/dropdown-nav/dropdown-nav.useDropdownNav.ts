import { useCallback, useId, useMemo, useRef } from "react";
import type { DropdownOptions, DropdownRef } from "../../hooks/useDropdown";

export type UseDropdownOptions = Partial<DropdownOptions>;
export const useDropdownNav = (options: UseDropdownOptions) => {
  const id = useId();
  const dropdownNavRef = useRef<DropdownRef | null>(null);

  const openNav = useCallback(() => {
    dropdownNavRef.current?.handleOpen(undefined, { ...options, id });
  }, [options, id]);

  const closeNav = useCallback(() => {
    dropdownNavRef.current?.handleClose();
  }, []);

  const toggleNav = useCallback(() => {
    dropdownNavRef.current?.handleToggle(undefined, { ...options, id });
  }, [options, id]);

  const handleTargetKeyDown = useCallback<
    Required<JSX.IntrinsicElements["button"]>["onKeyDown"]
  >(
    (e) => {
      switch (e.key) {
        case "Enter":
        case " ": // space
        case "ArrowDown":
          e.preventDefault(); // prevent the click event from also firing
          toggleNav();
          break;

        default:
          break;
      }
    },
    [toggleNav]
  );

  const targetProps = useMemo<JSX.IntrinsicElements["button"]>(() => {
    return {
      onKeyDown: handleTargetKeyDown,
      onClick: toggleNav,
      "aria-controls": id
    };
  }, [handleTargetKeyDown, toggleNav, id]);

  const dropdownProps = useMemo<
    Pick<Required<JSX.IntrinsicElements["article"]>, "id"> & {
      ref: typeof dropdownNavRef;
    }
  >(
    () => ({
      id,
      ref: dropdownNavRef
    }),
    [id]
  );

  return useMemo(
    () => ({
      targetProps,
      dropdownProps,
      openNav,
      closeNav,
      toggleNav
    }),
    [targetProps, dropdownProps, openNav, closeNav, toggleNav]
  );
};
