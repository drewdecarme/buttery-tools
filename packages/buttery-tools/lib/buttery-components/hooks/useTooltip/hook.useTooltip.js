import { useCallback, useMemo } from "react";
import { exhaustiveMatchGuard } from "../../utils";
import { useDropdown } from "../useDropdown";
import { ensurePopover } from "../usePopover";
export const useTooltip = (options) => {
    const { dropdownRef, setDropdownRef, setTargetRef, openDropdown, closeDropdown, toggleDropdown } = useDropdown(options);
    const setTooltipRef = useCallback((node) => {
        setDropdownRef(node);
        // add a few more styles specific to the dropdown version of the popover
        if (ensurePopover(dropdownRef.current)) {
            dropdownRef.current.style.position = "fixed";
            dropdownRef.current.style.inset = "unset";
            dropdownRef.current.role = "tooltip";
        }
    }, [setDropdownRef, dropdownRef.current]);
    const targetProps = useMemo(() => {
        switch (options.dxType) {
            case "tooltip": {
                let props = {
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
                            "aria-labelledby": options.id
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
    }, [options, openDropdown, closeDropdown, toggleDropdown, setTargetRef]);
    const tooltipProps = useMemo(() => ({
        ref: setTooltipRef
    }), [setTooltipRef]);
    return useMemo(() => ({
        targetProps,
        tooltipProps
    }), [targetProps, tooltipProps]);
};
