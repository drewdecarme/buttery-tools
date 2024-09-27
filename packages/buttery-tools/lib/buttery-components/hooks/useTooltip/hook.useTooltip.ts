import { type RefCallback, useCallback, useId, useMemo } from "react";
import { exhaustiveMatchGuard } from "../../utils";
import { type DropdownOptions, useDropdown } from "../useDropdown";
import { ensurePopover } from "../usePopover";

export type UseTooltipOptionsTooltip = DropdownOptions & {
  dxType: "tooltip";
} & (
    | {
        /**
         * Tooltip exists as a label that describes a control. It is intended
         * to be a simple description of the control that otherwise would have
         * a visible label but otherwise is hidden due to design or space.
         * @example "Notifications"
         */
        dxKind: "label";
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
        dxKind: "description";
      }
  );
export type UseTooltipOptionsToggleTip = DropdownOptions & {
  dxType: "toggletip";
  dxDescribedBy: string;
};

export type UseTooltipOptions =
  | UseTooltipOptionsTooltip
  | UseTooltipOptionsToggleTip;

export const useTooltip = <T extends HTMLElement>(
  options: UseTooltipOptions
) => {
  const id = useId();
  const {
    dropdownRef,
    setDropdownRef,
    setTargetRef,
    openDropdown,
    closeDropdown,
    toggleDropdown
  } = useDropdown<T>({ id, ...options });

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

  const targetProps = useMemo<JSX.IntrinsicElements["button"]>(() => {
    switch (options.dxType) {
      case "tooltip": {
        let props: JSX.IntrinsicElements["button"] = {
          onFocus: () => openDropdown(),
          onBlur: () => closeDropdown(),
          onMouseEnter: () => openDropdown(),
          onMouseLeave: () => closeDropdown()
        };
        switch (options.dxKind) {
          case "label":
            props = {
              ...props,
              ref: setTargetRef,
              type: "button",
              "aria-labelledby": options.dxLabeledBy
            };
            break;

          case "description":
            props = {
              ...props,
              ref: setTargetRef,
              type: "button",
              "aria-labelledby": id
            };
            break;

          default:
            exhaustiveMatchGuard(options);
        }
        return props;
      }

      case "toggletip":
        return {
          ref: setTargetRef,
          onClick: toggleDropdown
        };

      default:
        return exhaustiveMatchGuard(options);
    }
  }, [options, openDropdown, closeDropdown, toggleDropdown, setTargetRef, id]);

  const tooltipProps = useMemo(
    () => ({
      ref: setTooltipRef
    }),
    [setTooltipRef]
  );

  return useMemo(
    () => ({
      targetProps,
      tooltipProps
    }),
    [targetProps, tooltipProps]
  );
};
