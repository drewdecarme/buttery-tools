import { useCallback, useRef } from "react";
import { ensurePopover, ensureTarget, usePopover } from "../hook.usePopover";
import type { DropdownOptions } from "./hook.useDropdown.types";
import {
  processDropdownOptions,
  setDropdownPositionStyles,
} from "./hook.useDropdown.utils";

export type DropdownRefHandleOpen = (
  e?: React.MouseEvent,
  options?: DropdownOptions
) => void;

export type DropdownRef = {
  handleOpen: DropdownRefHandleOpen;
  handleClose: () => void;
  handleToggle: DropdownRefHandleOpen;
};

export const useDropdown = <PopoverElement extends HTMLElement>(
  options: DropdownOptions
) => {
  const {
    popoverRef,
    targetRef,
    setPopoverRef,
    setTargetRef,
    showPopover,
    hidePopover,
  } = usePopover<PopoverElement>({ id: options.id });

  const openDropdown = useCallback<DropdownRef["handleOpen"]>(
    (e, options) => {
      if (
        !ensurePopover(popoverRef.current) ||
        !ensureTarget(targetRef.current)
      ) {
        return;
      }

      const parsedOptions = processDropdownOptions(options);

      // position the dropdown element near the target
      setDropdownPositionStyles(parsedOptions.dxPosition, {
        arrow: parsedOptions.dxArrow,
        offset: parsedOptions.dxOffset,
        dropdownNode: popoverRef.current,
        targetNode: targetRef.current,
      });

      // show the popover
      showPopover();
    },
    [targetRef.current, popoverRef.current, showPopover]
  );

  const closeDropdown = useCallback(() => {
    hidePopover();
  }, [hidePopover]);

  const toggleDropdown = useCallback<DropdownRefHandleOpen>(
    (e, options) => {
      const isPopoverOpen = popoverRef.current?.classList.contains("open");
      if (isPopoverOpen) {
        return closeDropdown();
      }
      openDropdown(e, options);
    },
    [popoverRef.current, closeDropdown, openDropdown]
  );

  return {
    dropdownRef: popoverRef,
    setDropdownRef: setPopoverRef,
    targetRef,
    setTargetRef,
    closeDropdown,
    openDropdown,
    toggleDropdown,
  };
};
