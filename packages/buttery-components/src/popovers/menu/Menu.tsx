import { css } from "@linaria/core";
import {
  type RefCallback,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import {
  type DropdownOptions,
  type DropdownRef,
  useDropdown,
  usePortal,
} from "../../hooks";
import { classes } from "../../utils";

export type MenuPropsNative = JSX.IntrinsicElements["div"];
export type MenuPropsCustom = {
  targetRef: React.MutableRefObject<HTMLElement | null>;
};
export type MenuProps = MenuPropsNative & MenuPropsCustom;

const articleCSS = css`
  position: fixed;

  &:popover-open {
    position: fixed;
    inset: unset;
  }
`;

export const Menu = forwardRef<DropdownRef, MenuProps>(function Menu(
  { children, className, targetRef, ...restProps },
  ref
) {
  const { Portal, openPortal, closePortal } = usePortal();
  const { dropdownRef, popoverRef, initDropdown, closeDropdown, openDropdown } =
    useDropdown(targetRef);

  const windowListenerKey = useRef<((e: KeyboardEvent) => void) | null>(null);
  const windowListenerMouse = useRef<((e: MouseEvent) => void) | null>(null);

  const handleOpenMenu = useCallback<(options?: DropdownOptions) => void>(
    (options) => {
      initDropdown(options);
      openPortal();
    },
    [openPortal, initDropdown]
  );

  const handleCloseMenu = useCallback(async () => {
    // close the dropdown
    await closeDropdown();
    // remove event listeners
    if (!windowListenerKey.current || !windowListenerMouse.current) return;
    window.removeEventListener("keydown", windowListenerKey.current);
    window.removeEventListener("click", windowListenerMouse.current);
    // close the portal afterwards
    closePortal();
  }, [closePortal, closeDropdown]);

  // when the portal opens, the div will mount and the popover ref callback will run
  const menuRefCallback = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      // open the dropdown
      dropdownRef(node);
      openDropdown();

      // add event listeners
      windowListenerKey.current = (e) => {
        if (e.key !== "Escape") return;
        handleCloseMenu();
      };
      windowListenerMouse.current = (e) => {
        const clickedElement = e.target as HTMLElement;
        if (
          popoverRef.current?.contains(clickedElement) ||
          targetRef.current?.contains(clickedElement)
        ) {
          // clicked either on a child of the popover or the
          // target that launched the menu. Do nothing here.
          return;
        }
        handleCloseMenu();
      };
      window.addEventListener("keydown", windowListenerKey.current);
      window.addEventListener("click", windowListenerMouse.current);
    },
    [handleCloseMenu, targetRef, popoverRef, dropdownRef, openDropdown]
  );

  useImperativeHandle(ref, () => ({
    handleOpen: handleOpenMenu,
    handleClose: handleCloseMenu,
    handleToggle: (options) => {
      // this means that the popover is open
      if (popoverRef.current) {
        handleCloseMenu();
        // popover doesn't exist, thus is closed
      } else {
        handleOpenMenu(options);
      }
    },
  }));

  return (
    <Portal>
      <article
        {...restProps}
        className={classes(articleCSS, className)}
        ref={menuRefCallback}
      >
        {children}
      </article>
    </Portal>
  );
});
