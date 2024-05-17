
import { useRef, useCallback, useMemo, MutableRefObject } from "react";
import { DialogDefaultState, DialogRef } from "../dialog.useDialog";

export function useDrawer<T extends DialogDefaultState>() {
  const drawerRef = useRef<DialogRef<T>>(null);

  const openDrawer = useCallback<DialogRef<T>["handleOpen"]>((e, initData) => {
    if (!drawerRef.current) return;
    drawerRef.current.handleOpen(e, initData);
  }, []);

  const closeDrawer = useCallback<DialogRef<T>["handleClose"]>(() => {
    if (!drawerRef.current) return;
    drawerRef.current.handleClose();
  }, []);

  return useMemo(
    () => ({
      drawerRef: drawerRef as unknown as MutableRefObject<DialogRef>,
      openDrawer,
      closeDrawer,
    }),
    [closeDrawer, openDrawer]
  );
}
