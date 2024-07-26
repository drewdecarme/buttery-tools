import { type RefCallback, useCallback, useRef } from "react";
import type { DropdownOptions } from "./hook.useDropdown.types";
import {
  processDropdownOptions,
  setDropdownPositionStyles,
} from "./hook.useDropdown.utils";

export type DropdownRefHandleOpen = (
  e?: Event,
  options?: DropdownOptions
) => void;

export type DropdownRef = {
  handleOpen: DropdownRefHandleOpen;
  handleClose: () => void;
  handleToggle: DropdownRefHandleOpen;
};

export const useDropdown = <
  TargetElement extends HTMLElement | null = HTMLElement,
  DropdownElement extends HTMLElement | null = HTMLElement,
>(
  targetRef: React.MutableRefObject<TargetElement | null>,
  options?: DropdownOptions
) => {
  const popoverRef = useRef<DropdownElement | null>(null);
  const dropdownOptionsRef = useRef<Required<DropdownOptions>>(
    processDropdownOptions(options)
  );

  const dropdownRef = useCallback<RefCallback<DropdownElement>>((node) => {
    if (!node) return;
    popoverRef.current = node;
    popoverRef.current.popover = "manual";
    popoverRef.current.style.position = "fixed";
    popoverRef.current.style.inset = "unset";
  }, []);

  const closeDropdown = useCallback(async () => {
    if (!popoverRef.current || !targetRef.current) return;

    // add the close class to run the transition/animations with .close
    popoverRef.current.classList.replace("open", "close");
    // wait for all of the animations to run with .close
    const animations = popoverRef.current.getAnimations({ subtree: true });
    await Promise.allSettled(animations.map((animation) => animation.finished));
    // hide the popover when the animations complete
    popoverRef.current?.hidePopover();

    popoverRef.current.ariaExpanded = "false";
    targetRef.current.ariaExpanded = "false";
  }, [targetRef.current]);

  const initDropdown = useCallback<(options?: DropdownOptions) => void>(
    (options) => {
      dropdownOptionsRef.current = processDropdownOptions(options);
    },
    []
  );

  const openDropdown = useCallback<DropdownRef["handleOpen"]>(
    (_e, options) => {
      if (!popoverRef.current || !targetRef.current) {
        console.warn(
          "Popover and/or target aren't defined. Cannot determine position of popover."
        );
        return;
      }

      popoverRef.current.ariaExpanded = "true";
      targetRef.current.ariaExpanded = "true";

      if (options) {
        initDropdown(options);
      }

      // show the popover
      popoverRef.current.showPopover();

      // position the dropdown element near the target
      setDropdownPositionStyles(dropdownOptionsRef.current.dxPosition, {
        arrow: dropdownOptionsRef.current.dxArrow,
        offset: dropdownOptionsRef.current.dxOffset,
        dropdownNode: popoverRef.current,
        targetNode: targetRef.current,
      });

      // add the open class to run the transition/animations associated with .open
      popoverRef.current.classList.add("open");
    },
    [targetRef, initDropdown]
  );

  return { dropdownRef, popoverRef, closeDropdown, initDropdown, openDropdown };
};
