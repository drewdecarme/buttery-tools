import { type ForwardedRef, type ReactNode, forwardRef } from "react";

import {
  type ModalDefaultState,
  type ModalRef,
  type UseModalOptions,
  useModalDialog,
} from "../../hooks";
import { classes } from "../../utils";
import { ModalProvider } from "../Modal.context";

export type ModalPropsNative = Omit<JSX.IntrinsicElements["dialog"], "ref">;
export type ModalPropsCustom = Pick<
  UseModalOptions,
  "onClose" | "closeOnBackdropClick"
> & {
  children: ReactNode;
  dxSize?: "sm" | "md" | "lg" | "xl" | "full-screen";
};
export type ModalProps = ModalPropsNative & ModalPropsCustom;

export const Modal = forwardRef(function Modal<T extends ModalDefaultState>(
  { children, className, dxSize = "md", ...restProps }: ModalProps,
  ref: ForwardedRef<ModalRef<T>>
) {
  const { Portal, dialogRef, dialogState, closeModal } = useModalDialog<T>({
    ref,
    ...restProps,
  });

  return (
    <Portal>
      <ModalProvider initialState={dialogState} closeModal={closeModal}>
        <dialog ref={dialogRef} className={classes("modal", dxSize, className)}>
          {children}
        </dialog>
      </ModalProvider>
    </Portal>
  );
});
