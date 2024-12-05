import type {
  ModalDefaultState,
  ModalRef,
} from "@BUTTERY_COMPONENT/useModalDialog/index.js";
import { type MutableRefObject, useCallback, useMemo, useRef } from "react";

export function useModal<T extends ModalDefaultState>() {
  const modalRef = useRef<ModalRef<T>>(null);

  const openModal = useCallback<ModalRef<T>["handleOpen"]>((e, initData) => {
    if (!modalRef.current) return;
    modalRef.current.handleOpen(e, initData);
  }, []);

  const closeModal = useCallback<ModalRef<T>["handleClose"]>(() => {
    if (!modalRef.current) return;
    modalRef.current.handleClose();
  }, []);

  return useMemo(
    () => ({
      modalRef: modalRef as unknown as MutableRefObject<ModalRef>,
      openModal,
      closeModal,
    }),
    [closeModal, openModal]
  );
}
