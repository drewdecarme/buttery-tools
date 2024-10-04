import type {
  ModalDefaultState,
  ModalRef
} from "@BUTTERY_COMPONENT/useModalDialog";
import { type MutableRefObject, useCallback, useMemo, useRef } from "react";

export function useDrawer<T extends ModalDefaultState>() {
  const drawerRef = useRef<ModalRef<T>>(null);

  const openDrawer = useCallback<ModalRef<T>["handleOpen"]>((e, initData) => {
    if (!drawerRef.current) return;
    drawerRef.current.handleOpen(e, initData);
  }, []);

  const closeDrawer = useCallback<ModalRef<T>["handleClose"]>(() => {
    if (!drawerRef.current) return;
    drawerRef.current.handleClose();
  }, []);

  return useMemo(
    () => ({
      drawerRef: drawerRef as unknown as MutableRefObject<ModalRef>,
      openDrawer,
      closeDrawer
    }),
    [closeDrawer, openDrawer]
  );
}