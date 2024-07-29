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
  type DropdownRefHandleOpen,
  useDropdown,
  usePortal,
} from "../../hooks";
import { classes } from "../../utils";

export type DropdownMenuPropsNative = JSX.IntrinsicElements["div"] & {
  options: DropdownOptions;
};
export type DropdownMenuProps = DropdownMenuPropsNative;

type EventKeyboard = ((e: KeyboardEvent) => void) | null;
type EventMouse = ((e: MouseEvent) => void) | null;

export const DropdownMenu = forwardRef<DropdownRef, DropdownMenuProps>(
  function DropdownMenu({ children, options, className, ...restProps }, ref) {
    const { Portal, openPortal, closePortal } = usePortal();
    const {
      setDropdownRef,
      dropdownRef,
      targetRef,
      closeDropdown,
      openDropdown,
    } = useDropdown<HTMLElement>({ id: options.id });

    const windowListenerKey = useRef<EventKeyboard>(null);
    const windowListenerMouse = useRef<EventMouse>(null);

    const handleOpenDropdownMenu = useCallback<DropdownRefHandleOpen>(() => {
      openPortal();
    }, [openPortal]);

    const handleCloseDropdownMenu = useCallback(() => {
      // close the dropdown
      closeDropdown();
      // remove event listeners
      if (!windowListenerKey.current || !windowListenerMouse.current) return;
      window.removeEventListener("keydown", windowListenerKey.current);
      window.removeEventListener("click", windowListenerMouse.current);
      // close the portal afterwards
      closePortal();
      // clear the ref
      dropdownRef.current = null;
    }, [closePortal, closeDropdown, dropdownRef]);

    useImperativeHandle(ref, () => ({
      handleOpen: handleOpenDropdownMenu,
      handleClose: handleCloseDropdownMenu,
      handleToggle: (_e, options) => {
        // this means that the popover is open
        if (dropdownRef.current) {
          handleCloseDropdownMenu();
          // popover doesn't exist, thus is closed
        } else {
          handleOpenDropdownMenu(undefined, options);
        }
      },
    }));

    // when the portal opens, the div will mount and the popover ref callback will run
    const articleRef = useCallback<RefCallback<HTMLDivElement>>(
      (node) => {
        // open the dropdown
        setDropdownRef(node);
        openDropdown(undefined, options);

        // add event listeners
        windowListenerKey.current = (e) => {
          if (e.key !== "Escape") return;
          handleCloseDropdownMenu();
        };
        windowListenerMouse.current = (e) => {
          const clickedElement = e.target as HTMLElement;
          if (
            dropdownRef.current?.contains(clickedElement) ||
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
        options,
        handleCloseDropdownMenu,
        targetRef,
        dropdownRef,
        setDropdownRef,
        openDropdown,
      ]
    );

    return (
      <Portal>
        <article {...restProps} className={classes(className)} ref={articleRef}>
          {children}
        </article>
      </Portal>
    );
  }
);
