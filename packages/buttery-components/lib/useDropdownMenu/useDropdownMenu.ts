import type { RefCallback } from "react";
import { useId, useRef, useCallback, useMemo } from "react";

import { useDropdown } from "@BUTTERY_COMPONENT/useDropdown/useDropdown.js";
import type { DropdownOptions } from "@BUTTERY_COMPONENT/useDropdown/useDropdown.types.js";
/**
 * A dropdown menu hook designed to be used with display menus
 * when a button is clicked
 */
export function useDropdownMenu<DropdownNode extends HTMLElement>(
  options?: DropdownOptions
) {
  const id = useId();
  const iTargetRef = useRef<HTMLButtonElement | null>(null);
  const iMenuRef = useRef<DropdownNode | null>(null);
  const onClickRef = useRef<((e: MouseEvent) => void) | null>(null);
  const onKeydownRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const { openDropdown, closeDropdown, setDropdownRef, setTargetRef } =
    useDropdown<DropdownNode, HTMLButtonElement>(
      useMemo(
        () => ({
          id,
          dxArrow: options?.dxArrow,
          dxOffset: options?.dxOffset,
          dxPosition: options?.dxPosition,
        }),
        [id, options?.dxArrow, options?.dxOffset, options?.dxPosition]
      )
    );

  // Removes the window event listeners
  const removeWindowListeners = useCallback(() => {
    if (!onClickRef.current || !onKeydownRef.current) return;
    console.log("Removing click event listeners");
    window.removeEventListener("click", onClickRef.current);
    window.removeEventListener("keydown", onKeydownRef.current);
  }, []);

  // Closes the menu and removes the listeners
  const closeMenu = useCallback(() => {
    closeDropdown();
    removeWindowListeners();
  }, [closeDropdown, removeWindowListeners]);

  // Opens the dropdown and adds a listener and adds listeners
  // to handle when the menu should be closed
  const openMenu = useCallback(() => {
    console.log("Opening menu");

    // Add a window listener to listen for a click and determine
    // if its a part of the dropdown or target or not
    function handleWindowClick(e: MouseEvent) {
      const menu = iMenuRef.current;
      const target = iTargetRef.current;
      if (!menu || !target) return;

      const clickedNode = e.target as Node;
      const clickedNodeIsInOrIsMenu =
        menu.contains(clickedNode) || menu === clickedNode;
      const clickedNodeIsInOrIsTarget =
        target.contains(clickedNode) || target === clickedNode;

      if (clickedNodeIsInOrIsMenu || clickedNodeIsInOrIsTarget) return;
      console.log(
        "Element external to dropdown or target clicked. Closing menu"
      );
      closeMenu();
    }

    function handleWindowKeydown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      console.log("Escape key pressed. Closing menu");
      closeMenu();
    }

    // Wait until the dropdown has fully opened to add the event listener
    setTimeout(() => {
      onClickRef.current = handleWindowClick;
      onKeydownRef.current = handleWindowKeydown;
      console.log("Listening to click events to know when to close the menu");
      window.addEventListener("click", onClickRef.current);
      window.addEventListener("keydown", onKeydownRef.current);
    }, 0);

    openDropdown();
  }, [closeMenu, openDropdown]);

  // Set the dropdown node when the node mounts
  const menuRef = useCallback<RefCallback<DropdownNode>>(
    (node) => {
      if (!node) return;

      iMenuRef.current = node;
      setDropdownRef(node);
    },
    [setDropdownRef]
  );

  // Set the dropdown target when the target mounts
  const targetRef = useCallback<RefCallback<HTMLButtonElement>>(
    (node) => {
      if (!node) return;
      console.log("Setting menu target");

      // Opens the menu when the target is clicked
      function handleClickTarget(e: MouseEvent) {
        e.stopPropagation();
        if (!iMenuRef.current) return;
        if (iMenuRef.current.classList.contains("open")) {
          console.log("Target clicked. Closing menu");
          closeMenu();
        } else {
          openMenu();
        }
      }

      iTargetRef.current = node;
      setTargetRef(node);
      node.addEventListener("click", handleClickTarget);
    },
    [closeMenu, openMenu, setTargetRef]
  );

  return useMemo(
    () => ({
      targetRef,
      menuRef,
      closeMenu,
    }),
    [closeMenu, menuRef, targetRef]
  );
}
