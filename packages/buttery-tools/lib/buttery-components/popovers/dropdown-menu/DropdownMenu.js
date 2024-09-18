import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useCallback, useImperativeHandle, useRef, } from "react";
import { useDropdown, usePortal, } from "../../hooks";
import { getIsDropdownOpen } from "../../hooks/useDropdown/hook.useDropdown.utils";
import { classes } from "../../utils";
export const DropdownMenu = forwardRef(function DropdownMenu({ children, options, className, ...restProps }, ref) {
    const { Portal, openPortal, closePortal } = usePortal();
    const { setDropdownRef, dropdownRef, targetRef, closeDropdown, openDropdown, } = useDropdown(options);
    const windowListenerKey = useRef(null);
    const windowListenerMouse = useRef(null);
    const handleClose = useCallback(async () => {
        // close the dropdown
        await closeDropdown();
        dropdownRef.current = null;
        // remove event listeners
        if (!windowListenerKey.current || !windowListenerMouse.current)
            return;
        window.removeEventListener("keydown", windowListenerKey.current);
        window.removeEventListener("click", windowListenerMouse.current);
        // close the portal afterwards
        closePortal();
    }, [closePortal, closeDropdown, dropdownRef]);
    useImperativeHandle(ref, () => ({
        handleOpen: openPortal,
        handleClose,
        handleToggle: (_e) => {
            // this means that the popover is open
            if (dropdownRef.current) {
                handleClose();
                // popover doesn't exist, thus is closed
            }
            else {
                openPortal();
            }
        },
    }));
    // when the portal opens, the div will mount and the popover ref callback will run
    // this will also run when the component unmounts so we need to make sure that
    // we return early if there isn't a node in order to prevent window listeners
    // from continually being created thus making a memory leak.
    const articleRef = useCallback((node) => {
        if (!node)
            return;
        // open the dropdown
        setDropdownRef(node);
        openDropdown();
        // add event listeners
        windowListenerKey.current = (e) => {
            if (e.key !== "Escape")
                return;
            handleClose();
        };
        windowListenerMouse.current = (e) => {
            const isDropdownOpen = getIsDropdownOpen(dropdownRef);
            if (!isDropdownOpen)
                return;
            const clickedElement = e.target;
            const clickedDropdownChild = dropdownRef.current?.contains(clickedElement);
            const clickedTargetChild = targetRef.current?.contains(clickedElement);
            if (clickedTargetChild)
                return;
            if (clickedDropdownChild && clickedElement.nodeName !== "BUTTON")
                return;
            handleClose();
        };
        window.addEventListener("keydown", windowListenerKey.current);
        window.addEventListener("click", windowListenerMouse.current);
    }, [handleClose, targetRef, dropdownRef, setDropdownRef, openDropdown]);
    return (_jsx(Portal, { children: _jsx("article", { ...restProps, className: classes(className), ref: articleRef, children: children }) }));
});
