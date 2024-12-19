import { useId, useRef, useCallback, useMemo, useEffect } from "react";

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
  const targetRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<DropdownNode | null>(null);
  const isMenuOpenRef = useRef(false);

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

  // Closes the menu and removes the listeners
  const closeMenu = useCallback(() => {
    console.log("Closing menu");
    isMenuOpenRef.current = false;
    closeDropdown();
  }, [closeDropdown]);

  // Opens the dropdown
  const openMenu = useCallback(() => {
    console.log("Opening menu");
    isMenuOpenRef.current = true;
    openDropdown();
  }, [openDropdown]);

  // Set's the refs and adds listeners
  useEffect(() => {
    const menu = menuRef.current;
    const target = targetRef.current;
    if (!menu || !target) return;

    setTargetRef(target);
    setDropdownRef(menu);

    // Opens the menu when the target is clicked
    function handleClickTarget(e: MouseEvent) {
      e.stopPropagation();
      if (!menuRef.current) return;
      if (menuRef.current.classList.contains("open")) {
        console.log("Target clicked. Closing menu");
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Add a window listener to listen for a click and determine
    // if its a part of the dropdown or target or not
    function handleWindowClick(e: MouseEvent) {
      const isMenuOpen = isMenuOpenRef.current;
      const menu = menuRef.current;
      const target = targetRef.current;
      if (!menu || !target || !isMenuOpen) return;

      const clickedNode = e.target as Node;
      const clickedNodeIsInOrIsMenu =
        menu.contains(clickedNode) || menu === clickedNode;
      const clickedNodeIsInOrIsTarget =
        target.contains(clickedNode) || target === clickedNode;

      if (clickedNodeIsInOrIsMenu || clickedNodeIsInOrIsTarget) return;
      console.log(
        "Element external to dropdown or target clicked. Closing menu"
      );
      closeDropdown();
    }

    function handleWindowKeydown(e: KeyboardEvent) {
      if (!isMenuOpenRef.current) return;
      if (e.key !== "Escape") return;
      console.log("Escape key pressed. Closing menu");
      closeDropdown();
    }

    // add event listeners
    target.addEventListener("click", handleClickTarget);
    window.addEventListener("click", handleWindowClick);
    window.addEventListener("keydown", handleWindowKeydown);

    return () => {
      target.removeEventListener("click", handleClickTarget);
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("keydown", handleWindowKeydown);
    };
  }, [closeDropdown, closeMenu, openMenu, setDropdownRef, setTargetRef]);

  return useMemo(
    () => ({
      targetRef: targetRef,
      menuRef: menuRef,
      closeMenu,
    }),
    [closeMenu, menuRef, targetRef]
  );
}
