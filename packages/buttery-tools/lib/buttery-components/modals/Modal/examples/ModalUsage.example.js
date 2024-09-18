import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "../Modal";
import { useModal } from "../modal.useModal";
export default function ModalUsage() {
    const { modalRef, openModal } = useModal();
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: openModal, children: "Open a bare bones example" }), _jsx(Modal, { ref: modalRef, children: "This is the simplest implementation of a modal" })] }));
}
