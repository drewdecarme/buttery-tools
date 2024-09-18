import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useModalDialog, } from "../../hooks";
import { classes } from "../../utils";
import { ModalProvider } from "../Modal.context";
export const Modal = forwardRef(function Modal({ children, className, dxSize = "md", ...restProps }, ref) {
    const { Portal, dialogRef, dialogState, closeModal } = useModalDialog({
        ref,
        ...restProps,
    });
    return (_jsx(Portal, { children: _jsx(ModalProvider, { initialState: dialogState, closeModal: closeModal, children: _jsx("dialog", { ref: dialogRef, className: classes("modal", dxSize, className), children: children }) }) }));
});
