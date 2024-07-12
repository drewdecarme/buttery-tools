import { styled } from "@linaria/react";
import {
  type RefCallback,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { usePortal } from "../../hooks";
import { classes } from "../../utils";
import { MenuProvider } from "./Menu.context";
import {
  type MenuOptionArrow,
  type MenuOptionOffset,
  type MenuOptionPosition,
  type MenuOptions,
  type MenuRef,
  setPopoverPositionStyles,
} from "./menu.utils";

export type MenuPropsNative = JSX.IntrinsicElements["div"];
export type MenuPropsCustom = {
  targetRef: React.MutableRefObject<HTMLElement | null>;
};
export type MenuProps = MenuPropsNative & MenuPropsCustom;

const SArticle = styled("article")`
  position: fixed;

  &:popover-open {
    position: fixed;
    inset: unset;
  }
`;

export const Menu = forwardRef<MenuRef, MenuProps>(function Menu(
  { children, className, targetRef, ...restProps },
  ref
) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const { Portal, openPortal, closePortal } = usePortal();
  const windowListenerKey = useRef<((e: KeyboardEvent) => void) | null>(null);
  const windowListenerMouse = useRef<((e: MouseEvent) => void) | null>(null);
  const menuPositionRef = useRef<MenuOptionPosition>("bottom-left");
  const arrowSizeRef = useRef<MenuOptionArrow>({
    size: 16,
    color: "transparent",
  });
  const offsetRef = useRef<MenuOptionOffset>(0);

  const handleCloseMenu = useCallback(async () => {
    if (!popoverRef.current) return;

    // add the close class to run the transition/animations with .close
    popoverRef.current.classList.replace("open", "close");
    // wait for all of the animations to run with .close
    const animations = popoverRef.current.getAnimations({ subtree: true });
    await Promise.allSettled(animations.map((animation) => animation.finished));
    // hide the popover when the animations complete
    popoverRef.current?.hidePopover();
    // remove event listeners
    if (!windowListenerKey.current || !windowListenerMouse.current) return;
    window.removeEventListener("keydown", windowListenerKey.current);
    window.removeEventListener("click", windowListenerMouse.current);
    // close the portal afterwards
    closePortal();
    // clean the ref
    popoverRef.current = null;
  }, [closePortal]);

  // when the portal opens, the div will mount and the popover ref callback will run
  const initPopoverRef = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      if (!node) return;
      // set the internal ref
      popoverRef.current = node;
      // turn the div into a popover
      popoverRef.current.popover = "manual";

      if (!popoverRef.current || !targetRef.current) {
        console.warn(
          "Popover or target isn't defined. Cannot determine position of popover."
        );
        return;
      }

      // show the popover
      popoverRef.current.showPopover();

      // position the article near the target
      setPopoverPositionStyles(menuPositionRef.current, {
        arrow: arrowSizeRef.current,
        offset: offsetRef.current,
        popoverNode: popoverRef.current,
        targetNode: targetRef.current,
      });

      // add the open class to run the transition/animations associated with .open
      popoverRef.current.classList.add("open");

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
    [handleCloseMenu, targetRef]
  );

  const handleOpen = useCallback<(options?: MenuOptions) => void>(
    (options) => {
      menuPositionRef.current = options?.dxPosition || "bottom-left";
      arrowSizeRef.current = {
        size: options?.dxArrow?.size ?? 16,
        color: options?.dxArrow?.color ?? "transparent",
      };
      offsetRef.current = options?.dxOffset ?? 0;
      openPortal();
    },
    [openPortal]
  );

  useImperativeHandle(ref, () => ({
    handleOpen,
    handleClose: handleCloseMenu,
    handleToggle: (options) => {
      // this means that the popover is open
      if (popoverRef.current) {
        handleCloseMenu();
        // popover doesn't exist, thus is closed
      } else {
        handleOpen(options);
      }
    },
  }));

  return (
    <Portal>
      <MenuProvider closeMenu={handleCloseMenu}>
        <SArticle
          {...restProps}
          className={classes(className)}
          ref={initPopoverRef}
        >
          {children}
        </SArticle>
      </MenuProvider>
    </Portal>
  );
});
