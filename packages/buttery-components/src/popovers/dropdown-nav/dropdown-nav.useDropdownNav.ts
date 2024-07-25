import { useCallback, useMemo, useRef } from "react";
import type { DropdownOptions, DropdownRef } from "../../hooks";

export type UseDropdownOptions = Partial<DropdownOptions> & {
  /**
   * The ID of the dropdown. This id is used for accessibility purposes to ensure
   * that dropdown and the target have the necessary aria-roles.
   */
  id: string;
};
export const useDropdownNav = (options: UseDropdownOptions) => {
  const dropdownNavRef = useRef<DropdownRef | null>(null);
  const targetRef = useRef<HTMLButtonElement | null>(null);

  const openNav = useCallback(() => {
    dropdownNavRef.current?.handleOpen(undefined, options);
  }, [options]);

  const closeNav = useCallback(() => {
    dropdownNavRef.current?.handleClose();
  }, []);

  const toggleNav = useCallback(() => {
    dropdownNavRef.current?.handleToggle(undefined, options);
  }, [options]);

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

  const targetProps = useMemo<JSX.IntrinsicElements["button"]>(
    () => ({
      "aria-haspopup": true,
      "aria-expanded": false,
      "aria-controls": options.id,
      onKeyDown: handleTargetKeyDown,
      onClick: toggleNav,
      ref: targetRef,
    }),
    [handleTargetKeyDown, options.id, toggleNav]
  );

  const dropdownProps = useMemo<
    Pick<JSX.IntrinsicElements["article"], "id"> & {
      ref: typeof dropdownNavRef;
      targetRef: typeof targetRef;
    }
  >(
    () => ({
      id: options.id,
      ref: dropdownNavRef,
      targetRef,
    }),
    [options.id]
  );

  return useMemo(
    () => ({
      targetProps,
      dropdownProps,
      openNav,
      closeNav,
      toggleNav,
    }),
    [targetProps, dropdownProps, openNav, closeNav, toggleNav]
  );
};
