import { type ForwardedRef, type ReactNode, forwardRef } from "react";

import {
  type ModalDefaultState,
  type ModalRef,
  type UseModalOptions,
  useModalDialog,
} from "../../hooks";
import { classes } from "../../utils";
import { ModalProvider } from "../Modal.context";
import styles from "./drawer.styles";

export type DrawerPropsNative = Omit<JSX.IntrinsicElements["dialog"], "ref">;
export type DrawerPropsCustom = Pick<
  UseModalOptions,
  "onClose" | "closeOnBackdropClick"
> & {
  children: ReactNode;
  dxOrientation?:
    | "left-to-right"
    | "right-to-left"
    | "top-to-bottom"
    | "bottom-to-top";
};
export type DrawerProps = DrawerPropsNative & DrawerPropsCustom;

export const Drawer = forwardRef(function Drawer<T extends ModalDefaultState>(
  {
    children,
    dxOrientation = "left-to-right",
    className,
    ...restProps
  }: DrawerProps,
  ref: ForwardedRef<ModalRef<T>>
) {
  const { Portal, dialogRef, dialogState, closeModal } = useModalDialog<T>({
    ref,
    ...restProps,
  });

  return (
    <Portal>
      <ModalProvider initialState={dialogState} closeModal={closeModal}>
        <dialog
          ref={dialogRef}
          className={classes("drawer", styles, dxOrientation, className)}
        >
          {children}
        </dialog>
      </ModalProvider>
    </Portal>
  );
});
