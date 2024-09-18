import type { ModalDefaultState, ModalRef } from "../../hooks";
import { type ModalPropsCustom, type ModalPropsNative } from "../Modal";
export type DrawerPropsNative = ModalPropsNative;
export type DrawerPropsCustom = ModalPropsCustom & {
    dxOrientation?: "slide-left" | "slide-right" | "slide-down" | "slide-up";
};
export type DrawerProps = DrawerPropsNative & DrawerPropsCustom;
export declare const Drawer: import("react").ForwardRefExoticComponent<ModalPropsNative & Pick<import("../..").UseModalOptions, "onClose" | "closeOnBackdropClick"> & {
    children: import("react").ReactNode;
    dxSize?: "sm" | "md" | "lg" | "xl" | "full-screen";
} & {
    dxOrientation?: "slide-left" | "slide-right" | "slide-down" | "slide-up";
} & import("react").RefAttributes<ModalRef<ModalDefaultState>>>;
//# sourceMappingURL=Drawer.d.ts.map