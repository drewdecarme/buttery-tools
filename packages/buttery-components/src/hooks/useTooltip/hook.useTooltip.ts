import { type RefCallback, useCallback, useEffect, useMemo } from "react";
import { type DropdownOptions, ensurePopover, useDropdown } from "..";
import { exhaustiveMatchGuard } from "../../utils";

export type UseTooltipOptions = DropdownOptions & {
  /**
   * The optional strategy in which the tooltip should be
   * launched.
   * - **"focus/hover"** should be used for targets that also have an action associated
   * with them like doing something or going somewhere
   * - **"click"** turns the target into a supplemental action where the only action
   * that is associated with the target is providing more information
   *
   * @default "focus/hover"
   */
  dxStrategy?: "focus/hover" | "click";
} & (
    | {
        /**
         * Tooltip exists as a label that describes a control. It is intended
         * to be a simple description of the control that otherwise would have
         * a visible label but otherwise is hidden due to design or space.
         * @example "Notifications"
         */
        dxType: "label";
        /**
         * This is an accessibility control that helps further context
         * what the screen reader is going to interpret. This field can be many node
         * IDs delimited by a space which should be read semantically by the screen reader.
         *
         * Let's say that there is a tooltip that has "Likes" as it's content
         * but it also has a bubble or a burst icon inside of it that details how
         * many likes there are. In this case, we need to supply another id that _labels_
         * the tooltip; let's call it "likes-count". In order for screen readers to
         * appropriately read the tooltip and the context, it needs to understand
         * which nodes with IDs label the focusable element.
         *
         * In this case we would put `likes-count likes-label` where the screen reader
         * would read "3 Likes"
         */
        dxLabeledBy: string;
      }
    | {
        /**
         * Tooltip exists as an extra clarification for a control. Provides
         * supplementary descriptions or text to better guide the user
         * on how to do something with a particular control
         * @example "View notifications and manage settings"
         */
        dxType: "description";
      }
  );

export const useTooltip = <T extends HTMLElement>(
  options: UseTooltipOptions
) => {
  const {
    dropdownRef,
    targetRef,
    setDropdownRef,
    setTargetRef,
    openDropdown,
    closeDropdown,
    toggleDropdown,
  } = useDropdown<T>(options);

  const setTooltipRef = useCallback<RefCallback<T>>(
    (node) => {
      setDropdownRef(node);
      // add a few more styles specific to the dropdown version of the popover
      if (ensurePopover(dropdownRef.current)) {
        dropdownRef.current.style.position = "fixed";
        dropdownRef.current.style.inset = "unset";
        dropdownRef.current.role = "tooltip";
      }
    },
    [setDropdownRef, dropdownRef.current]
  );

  const targetEvents = useMemo<JSX.IntrinsicElements["button"]>(() => {
    const strategy = options.dxStrategy ?? "focus/hover";

    switch (strategy) {
      case "focus/hover":
        return {
          onFocus: () => openDropdown(),
          onBlur: () => closeDropdown(),
          onMouseEnter: () => openDropdown(),
          onMouseLeave: () => closeDropdown(),
        };

      case "click":
        return {
          onClick: toggleDropdown,
        };

      default:
        return exhaustiveMatchGuard(strategy);
    }
  }, [options.dxStrategy, openDropdown, closeDropdown, toggleDropdown]);

  const targetProps = useMemo<JSX.IntrinsicElements["button"]>(() => {
    switch (options.dxType) {
      case "label":
        return {
          ...targetEvents,
          ref: setTargetRef,
          type: "button",
          "aria-labelledby": options.dxLabeledBy,
        };

      case "description":
        return {
          ...targetEvents,
          ref: setTargetRef,
          type: "button",
          "aria-labelledby": options.id,
        };

      default:
        return exhaustiveMatchGuard(options);
    }
  }, [options, setTargetRef, targetEvents]);

  const tooltipProps = useMemo(
    () => ({
      ref: setTooltipRef,
    }),
    [setTooltipRef]
  );

  return useMemo(
    () => ({
      targetProps,
      tooltipProps,
    }),
    [targetProps, tooltipProps]
  );
};
