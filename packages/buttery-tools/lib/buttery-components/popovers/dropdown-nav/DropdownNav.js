import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useCallback, useImperativeHandle, useRef, } from "react";
import { useDropdown, } from "../../hooks";
import { getIsDropdownOpen } from "../../hooks/useDropdown/hook.useDropdown.utils";
import { classes } from "../../utils";
export const DropdownNav = forwardRef(function DropdownNav({ children, className, id, ...restProps }, ref) {
    const { setDropdownRef, dropdownRef, targetRef, closeDropdown, openDropdown, } = useDropdown({ id });
    const windowListenerKey = useRef(null);
    const windowListenerMouse = useRef(null);
    const handleClose = useCallback(async () => {
        // close the dropdown
        await closeDropdown();
        // remove event listeners
        if (!windowListenerKey.current || !windowListenerMouse.current)
            return;
        window.removeEventListener("keydown", windowListenerKey.current);
        window.removeEventListener("click", windowListenerMouse.current);
    }, [closeDropdown]);
    const handleOpen = useCallback((e, options) => {
        openDropdown(e, options);
        // Close the dropdown when Escape is pressed
        windowListenerKey.current = (e) => {
            if (e.key !== "Escape")
                return;
            handleClose();
        };
        window.addEventListener("keydown", windowListenerKey.current);
        // Close the dropdown when anything besides the target + it's children
        // and the dropdown it's children are clicked.
        windowListenerMouse.current = (e) => {
            const clickedElement = e.target;
            // Check if the clicked element an anchor tag or is
            // an element that is a descendent of an anchor tag
            const anchorTags = Array.from(dropdownRef.current?.getElementsByTagName("a") ?? []);
            for (const anchorTag of anchorTags) {
                if (anchorTag === clickedElement ||
                    anchorTag.contains(clickedElement)) {
                    return handleClose();
                }
            }
            // Check if the clicked element is a child of the target
            // or is a child of the dropdown. If it does then we're not
            // going to do anything.
            if (dropdownRef.current?.contains(clickedElement) ||
                targetRef.current?.contains(clickedElement)) {
                return;
            }
            handleClose();
        };
        window.addEventListener("click", windowListenerMouse.current);
    }, [handleClose, targetRef, dropdownRef, openDropdown]);
    const handleToggle = useCallback((e, options) => {
        const isPopoverOpen = getIsDropdownOpen(dropdownRef);
        if (isPopoverOpen) {
            return handleClose();
        }
        return handleOpen(e, options);
    }, [handleClose, handleOpen, dropdownRef]);
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
    const articleRef = useCallback((node) => {
        // init the dropdown
        setDropdownRef(node);
    }, [setDropdownRef]);
    return (_jsx("article", { ...restProps, id: id, className: classes(className), ref: articleRef, children: children }));
});
