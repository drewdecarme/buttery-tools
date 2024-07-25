import {
  type RefCallback,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { type DropdownRef, useDropdown } from "../../hooks";
import { classes } from "../../utils";

export type DropdownNavPropsNative = JSX.IntrinsicElements["div"];
export type DropdownNavPropsCustom = {
  targetRef: React.MutableRefObject<HTMLElement | null>;
};
export type DropdownNavProps = DropdownNavPropsNative & DropdownNavPropsCustom;

export const DropdownNav = forwardRef<DropdownRef, DropdownNavProps>(
  function DropdownNav(
    { children, className, targetRef, id, ...restProps },
    ref
  ) {
    const { dropdownRef, popoverRef, closeDropdown, openDropdown } =
      useDropdown(targetRef);

    /**
     * Intercepts the ref and adds functionality
     * from this component to the exposed handlers.
     */
    useImperativeHandle(ref, () => ({
      handleOpen: openDropdown,
      handleClose: closeDropdown,
      handleToggle: (e, options) => {
        const isPopoverOpen = popoverRef.current?.classList.contains("open");

        // close the dropdown
        if (isPopoverOpen) {
          return closeDropdown();
        }

        // open the dropdown
        openDropdown(e, options);
      },
    }));

    // when the portal opens, the article will mount and the popover ref callback will run
    // NOTE that this will only run one time
    const dropdownNavRefCallback = useCallback<RefCallback<HTMLDivElement>>(
      (node) => {
        // init the dropdown
        dropdownRef(node);

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
            popoverRef.current?.contains(clickedElement) ||
            targetRef.current?.contains(clickedElement)
          ) {
            return;
          }
          closeDropdown();
        });
      },
      [closeDropdown, targetRef, popoverRef, dropdownRef]
    );

    return (
      <article
        {...restProps}
        id={id}
        className={classes(className)}
        ref={dropdownNavRefCallback}
      >
        {children}
      </article>
    );
  }
);
