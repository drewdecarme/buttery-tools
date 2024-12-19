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
  const onWindowClickRef = useRef<((e: MouseEvent) => void) | null>(null);
  const onWindowKeydownRef = useRef<((e: KeyboardEvent) => void) | null>(null);
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

    const onWindowClick = onWindowClickRef.current;
    const onWindowKeydown = onWindowKeydownRef.current;
    if (!onWindowClick || !onWindowKeydown) return;

    // Remove event listeners
    console.log("Removing window event listeners");
    window.removeEventListener("click", onWindowClick);
    window.removeEventListener("keydown", onWindowKeydown);

    closeDropdown();
  }, [closeDropdown]);

  // Opens the dropdown
  const openMenu = useCallback(() => {
    console.log("Opening menu");

    // Add a window listener to listen for a click and determine
    // if its a part of the dropdown or target or not
    function handleWindowClick(e: MouseEvent) {
      const isMenuOpen = isMenuOpenRef.current;
      const menu = menuRef.current;
      const target = targetRef.current;
      if (!menu || !target || !isMenuOpen) return;

      const clickedNode = e.target as Node;
      if (
        menu.contains(clickedNode) ||
        menu === clickedNode ||
        target.contains(clickedNode) ||
        target === clickedNode
      ) {
        return;
      }
      console.log("External node to dropdown or target clicked. Moving");
      closeMenu();
    }

    // Close the dropdown when the escape key is pressed
    function handleWindowKeydown(e: KeyboardEvent) {
      if (!isMenuOpenRef.current) return;
      if (e.key !== "Escape") return;
      console.log("Escape key pressed. Closing menu");
      closeMenu();
    }

    console.log("Adding window event listeners to determine when to close");
    isMenuOpenRef.current = true;
    onWindowClickRef.current = handleWindowClick;
    onWindowKeydownRef.current = handleWindowKeydown;

    window.addEventListener("click", onWindowClickRef.current);
    window.addEventListener("keydown", onWindowKeydownRef.current);

    openDropdown();
  }, [closeMenu, openDropdown]);

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

    // Add event listeners
    target.addEventListener("click", handleClickTarget);

    return () => {
      // Remove event listeners
      target.removeEventListener("click", handleClickTarget);
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
