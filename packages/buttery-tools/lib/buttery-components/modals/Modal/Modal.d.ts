import { type ReactNode } from "react";
import { type ModalDefaultState, type ModalRef, type UseModalOptions } from "../../hooks";
export type ModalPropsNative = Omit<JSX.IntrinsicElements["dialog"], "ref">;
export type ModalPropsCustom = Pick<UseModalOptions, "onClose" | "closeOnBackdropClick"> & {
    children: ReactNode;
    dxSize?: "sm" | "md" | "lg" | "xl" | "full-screen";
};
export type ModalProps = ModalPropsNative & ModalPropsCustom;
export declare const Modal: import("react").ForwardRefExoticComponent<ModalPropsNative & Pick<UseModalOptions, "onClose" | "closeOnBackdropClick"> & {
    children: ReactNode;
    dxSize?: "sm" | "md" | "lg" | "xl" | "full-screen";
} & import("react").RefAttributes<ModalRef<ModalDefaultState>>>;
//# sourceMappingURL=Modal.d.ts.map