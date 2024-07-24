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

export type DropdownMenuPropsNative = JSX.IntrinsicElements["div"];
export type DropdownMenuPropsCustom = {
  targetRef: React.MutableRefObject<HTMLElement | null>;
};
export type DropdownMenuProps = DropdownMenuPropsNative &
  DropdownMenuPropsCustom;

const articleCSS = css`
  position: fixed;

  &:popover-open {
    position: fixed;
    inset: unset;
  }
`;

export const DropdownMenu = forwardRef<DropdownRef, DropdownMenuProps>(
  function DropdownMenu({ children, className, targetRef, ...restProps }, ref) {
    const { Portal, openPortal, closePortal } = usePortal();
    const {
      dropdownRef,
      popoverRef,
      initDropdown,
      closeDropdown,
      openDropdown,
    } = useDropdown(targetRef);

    const windowListenerKey = useRef<((e: KeyboardEvent) => void) | null>(null);
    const windowListenerMouse = useRef<((e: MouseEvent) => void) | null>(null);

    const handleOpenDropdownMenu = useCallback<
      (options?: DropdownOptions) => void
    >(
      (options) => {
        initDropdown(options);
        openPortal();
      },
      [openPortal, initDropdown]
    );

    const handleCloseDropdownMenu = useCallback(async () => {
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
          handleCloseDropdownMenu();
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
          handleCloseDropdownMenu();
        };
        window.addEventListener("keydown", windowListenerKey.current);
        window.addEventListener("click", windowListenerMouse.current);
      },
      [
        handleCloseDropdownMenu,
        targetRef,
        popoverRef,
        dropdownRef,
        openDropdown,
      ]
    );

    useImperativeHandle(ref, () => ({
      handleOpen: handleOpenDropdownMenu,
      handleClose: handleCloseDropdownMenu,
      handleToggle: (options) => {
        // this means that the popover is open
        if (popoverRef.current) {
          handleCloseDropdownMenu();
          // popover doesn't exist, thus is closed
        } else {
          handleOpenDropdownMenu(options);
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
  }
);
