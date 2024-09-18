import { useCallback, useId, useMemo, useRef } from "react";
export const useDropdownNav = (options) => {
    const id = useId();
    const dropdownNavRef = useRef(null);
    const openNav = useCallback(() => {
        dropdownNavRef.current?.handleOpen(undefined, { ...options, id });
    }, [options, id]);
    const closeNav = useCallback(() => {
        dropdownNavRef.current?.handleClose();
    }, []);
    const toggleNav = useCallback(() => {
        dropdownNavRef.current?.handleToggle(undefined, { ...options, id });
    }, [options, id]);
    const handleTargetKeyDown = useCallback((e) => {
        switch (e.key) {
            case "Enter":
            case " ": // space
            case "ArrowDown":
                e.preventDefault(); // prevent the click event from also firing
                toggleNav();
                break;
            default:
                break;
        }
    }, [toggleNav]);
    const targetProps = useMemo(() => {
        return {
            onKeyDown: handleTargetKeyDown,
            onClick: toggleNav,
            "aria-controls": id
        };
    }, [handleTargetKeyDown, toggleNav, id]);
    const dropdownProps = useMemo(() => ({
        id,
        ref: dropdownNavRef
    }), [id]);
    return useMemo(() => ({
        targetProps,
        dropdownProps,
        openNav,
        closeNav,
        toggleNav
    }), [targetProps, dropdownProps, openNav, closeNav, toggleNav]);
};
