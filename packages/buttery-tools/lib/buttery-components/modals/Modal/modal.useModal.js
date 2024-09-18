import { useCallback, useMemo, useRef } from "react";
export function useModal() {
    const modalRef = useRef(null);
    const openModal = useCallback((e, initData) => {
        if (!modalRef.current)
            return;
        modalRef.current.handleOpen(e, initData);
    }, []);
    const closeModal = useCallback(() => {
        if (!modalRef.current)
            return;
        modalRef.current.handleClose();
    }, []);
    return useMemo(() => ({
        modalRef: modalRef,
        openModal,
        closeModal,
    }), [closeModal, openModal]);
}
