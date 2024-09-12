import {
  type RefCallback,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { type DropdownRef, useDropdown } from "../../hooks";
import { classes } from "../../utils";

export type DropdownNavPropsNative = JSX.IntrinsicElements["div"] & {
  id: string;
};
export type DropdownNavProps = DropdownNavPropsNative;

export const DropdownNav = forwardRef<DropdownRef, DropdownNavProps>(
  function DropdownNav({ children, className, id, ...restProps }, ref) {
    const {
      setDropdownRef,
      dropdownRef,
      targetRef,
      closeDropdown,
      openDropdown,
      toggleDropdown,
    } = useDropdown<HTMLElement>({ id });

    /**
     * Intercepts the ref and adds functionality
     * from this component to the exposed handlers.
     */
    useImperativeHandle(ref, () => ({
      handleOpen: openDropdown,
      handleClose: closeDropdown,
      handleToggle: toggleDropdown,
    }));

    // when the portal opens, the article will mount and the popover ref callback will run
    // NOTE that this will only run one time
    const articleRef = useCallback<RefCallback<HTMLElement>>(
      (node) => {
        // init the dropdown
        setDropdownRef(node);

        // Close the dropdown when Escape is pressed
        window.addEventListener("keydown", (e) => {
          if (e.key !== "Escape") return;
          closeDropdown();
        });

        // Close the dropdown when anything besides the target + it's children
        // and the dropdown it's children are clicked.
        window.addEventListener("click", (e) => {
          const clickedElement = e.target as HTMLElement;
          if (
            dropdownRef.current?.contains(clickedElement) ||
            targetRef.current?.contains(clickedElement)
          ) {
            return;
          }
          closeDropdown();
        });
      },
      [closeDropdown, targetRef, dropdownRef, setDropdownRef]
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
