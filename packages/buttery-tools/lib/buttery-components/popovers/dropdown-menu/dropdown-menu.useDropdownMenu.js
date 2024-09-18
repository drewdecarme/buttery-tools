import { useCallback, useMemo, useRef } from "react";
export const useDropdownMenu = (options) => {
    const dropdownMenuRef = useRef(null);
    const openMenu = useCallback(() => {
        dropdownMenuRef.current?.handleOpen(undefined, options);
    }, [options]);
    const closeMenu = useCallback(() => {
        dropdownMenuRef.current?.handleClose();
    }, []);
    const toggleMenu = useCallback(() => {
        dropdownMenuRef.current?.handleToggle(undefined, options);
    }, [options]);
    const handleTargetKeyDown = useCallback((e) => {
        switch (e.key) {
            case "Enter":
            case " ": // space
                e.preventDefault(); // prevent the click event from also firing
                toggleMenu();
                break;
            default:
                break;
        }
    }, [toggleMenu]);
    const targetProps = useMemo(() => {
        return {
            type: "button",
            "aria-expanded": false,
            "aria-controls": options.id,
            onKeyDown: handleTargetKeyDown,
            onClick: toggleMenu,
        };
    }, [handleTargetKeyDown, options.id, toggleMenu]);
    const dropdownProps = useMemo(() => ({
        options,
        ref: dropdownMenuRef,
    }), [options]);
    return useMemo(() => ({
        targetProps,
        dropdownProps,
        openMenu,
        closeMenu,
        toggleMenu,
    }), [openMenu, closeMenu, toggleMenu, targetProps, dropdownProps]);
};
