import { type ForwardedRef, type ReactNode, forwardRef } from "react";

import {
  type ModalDefaultState,
  type ModalRef,
  type UseModalOptions,
  useModalDialog,
} from "@@dependency/useModalDialog";
import { classes } from "@@dependency/utils";
import { ModalProvider } from "./Modal.provider";

export type ModalPropsNative = Omit<JSX.IntrinsicElements["dialog"], "ref">;
export type ModalPropsCustom = UseModalOptions & {
  children: ReactNode;
  dxSize?: "sm" | "md" | "lg" | "xl" | "full-screen";
};
export type ModalProps = ModalPropsNative & ModalPropsCustom;

export const Modal = forwardRef(function Modal<T extends ModalDefaultState>(
  { children, className, dxSize = "md", ...restProps }: ModalProps,
  ref: ForwardedRef<ModalRef<T>>
) {
  const { isOpen, dialogRef, dialogState, closeModal } = useModalDialog<T>({
    ref,
    ...restProps,
  });

  if (!isOpen) return;

  return (
    <dialog
      id={restProps.id}
      ref={dialogRef}
      className={classes("modal", dxSize, className)}
    >
      <ModalProvider initialState={dialogState} closeModal={closeModal}>
        {children}
      </ModalProvider>
    </dialog>
  );
});
