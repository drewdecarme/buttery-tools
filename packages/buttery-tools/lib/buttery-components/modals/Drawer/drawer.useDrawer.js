import { useCallback, useMemo, useRef } from "react";
export function useDrawer() {
    const drawerRef = useRef(null);
    const openDrawer = useCallback((e, initData) => {
        if (!drawerRef.current)
            return;
        drawerRef.current.handleOpen(e, initData);
    }, []);
    const closeDrawer = useCallback(() => {
        if (!drawerRef.current)
            return;
        drawerRef.current.handleClose();
    }, []);
    return useMemo(() => ({
        drawerRef: drawerRef,
        openDrawer,
        closeDrawer,
    }), [closeDrawer, openDrawer]);
}
