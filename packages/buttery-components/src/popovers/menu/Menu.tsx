import { clsx } from "clsx";
import {
  type RefCallback,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { usePortal } from "../../hooks";
import { MenuProvider } from "./Menu.context";
import type { MenuRef } from "./menu.utils";

export type MenuPropsNative = JSX.IntrinsicElements["div"];
export type MenuPropsCustom = {
  targetRef: React.MutableRefObject<HTMLElement | null>;
};
export type MenuProps = MenuPropsNative & MenuPropsCustom;

export const Menu = forwardRef<MenuRef, MenuProps>(function Menu(
  { children, className, targetRef, ...restProps },
  ref
) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const { Portal, openPortal, closePortal } = usePortal();
  const windowEventListenerRef = useRef<((e: KeyboardEvent) => void) | null>(
    null
  );

  const handleCloseMenu = useCallback(async () => {
    if (!popoverRef.current) return;

    // add the close class to run the transition/animations with .close
    popoverRef.current.classList.replace("open", "close");
    // wait for all of the animations to run with .close
    const popoverAnimations = popoverRef.current.getAnimations();
    await Promise.all(popoverAnimations);
    // hide the popover when the animations complete
    popoverRef.current?.hidePopover();
    // remove event listeners
    if (!windowEventListenerRef.current) return;
    window.removeEventListener("keydown", windowEventListenerRef.current);
    // close the portal afterwards
    closePortal();
  }, [closePortal]);

  // when the portal opens, the div will mount and the popover ref callback will run
  const initPopoverRef = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      if (!node) return;
      // set the internal ref
      popoverRef.current = node;
      // turn the div into a popover
      popoverRef.current.popover = "manual";
      popoverRef.current.showPopover();
      // add the open class to run the transition/animations associated with .open
      popoverRef.current.classList.add("open");

      // add event listeners
      windowEventListenerRef.current = (e) => {
        if (e.key !== "Escape") return;
        handleCloseMenu();
      };
      window.addEventListener("keydown", windowEventListenerRef.current);
    },
    [handleCloseMenu]
  );

  useImperativeHandle(ref, () => ({
    handleOpen: () => {
      console.log(targetRef.current);
      openPortal();
    },
    handleClose: handleCloseMenu,
  }));

  return (
    <Portal>
      <MenuProvider closeMenu={handleCloseMenu}>
        <div {...restProps} className={clsx(className)} ref={initPopoverRef}>
          {children}
        </div>
      </MenuProvider>
    </Portal>
  );
});
