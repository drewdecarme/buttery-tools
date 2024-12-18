import {
  type DropdownRef,
  type DropdownRefHandleOpen,
  useDropdown,
} from "@BUTTERY_COMPONENT/useDropdown";
import { getIsDropdownOpen } from "@BUTTERY_COMPONENT/useDropdown";
import { classes } from "@BUTTERY_COMPONENT/utils";
import {
  type RefCallback,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";

export type DropdownNavPropsNative = JSX.IntrinsicElements["div"] & {
  id: string;
};
export type DropdownNavProps = DropdownNavPropsNative;

type EventKeyboard = ((e: KeyboardEvent) => void) | null;
type EventMouse = ((e: MouseEvent) => void) | null;

export const DropdownNav = forwardRef<DropdownRef, DropdownNavProps>(
  function DropdownNav({ children, className, id, ...restProps }, ref) {
    const {
      setDropdownRef,
      dropdownRef,
      targetRef,
      closeDropdown,
      openDropdown,
    } = useDropdown<HTMLElement>({ id });

    const windowListenerKey = useRef<EventKeyboard>(null);
    const windowListenerMouse = useRef<EventMouse>(null);

    const handleClose = useCallback<() => Promise<void>>(async () => {
      // close the dropdown
      await closeDropdown();
      // remove event listeners
      if (!windowListenerKey.current || !windowListenerMouse.current) return;
      window.removeEventListener("keydown", windowListenerKey.current);
      window.removeEventListener("click", windowListenerMouse.current);
    }, [closeDropdown]);

    const handleOpen = useCallback<DropdownRefHandleOpen>(
      (e, options) => {
        openDropdown(e, options);

        // Close the dropdown when Escape is pressed
        windowListenerKey.current = (e) => {
          if (e.key !== "Escape") return;
          handleClose();
        };
        window.addEventListener("keydown", windowListenerKey.current);

        // Close the dropdown when anything besides the target + it's children
        // and the dropdown it's children are clicked.
        windowListenerMouse.current = (e) => {
          const clickedElement = e.target as HTMLElement;

          // Check if the clicked element an anchor tag or is
          // an element that is a descendent of an anchor tag
          const anchorTags = Array.from(
            dropdownRef.current?.getElementsByTagName("a") ?? []
          );
          for (const anchorTag of anchorTags) {
            if (
              anchorTag === clickedElement ||
              anchorTag.contains(clickedElement)
            ) {
              return handleClose();
            }
          }

          // Check if the clicked element is a child of the target
          // or is a child of the dropdown. If it does then we're not
          // going to do anything.
          if (
            dropdownRef.current?.contains(clickedElement) ||
            targetRef.current?.contains(clickedElement)
          ) {
            return;
          }

          handleClose();
        };
        window.addEventListener("click", windowListenerMouse.current);
      },
      [handleClose, targetRef, dropdownRef, openDropdown]
    );

    const handleToggle = useCallback<DropdownRefHandleOpen>(
      (e, options) => {
        const isPopoverOpen = getIsDropdownOpen(dropdownRef);
        if (isPopoverOpen) {
          return handleClose();
        }
        return handleOpen(e, options);
      },
      [handleClose, handleOpen, dropdownRef]
    );

    /**
     * Intercepts the ref and adds functionality
     * from this component to the exposed handlers.
     */
    useImperativeHandle(ref, () => ({
      handleOpen,
      handleClose,
      handleToggle,
    }));

    // when the portal opens, the article will mount and the popover ref callback will run
    // NOTE that this will only run one time
    const articleRef = useCallback<RefCallback<HTMLElement>>(
      (node) => {
        // init the dropdown
        setDropdownRef(node);
      },
      [setDropdownRef]
    );

    return (
      <article
        {...restProps}
        id={id}
        className={classes(className)}
        ref={articleRef}
      >
        {children}
      </article>
    );
  }
);
