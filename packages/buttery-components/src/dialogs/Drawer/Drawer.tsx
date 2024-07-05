import { type ForwardedRef, type ReactNode, forwardRef } from "react";

import clsx from "clsx";
import { DialogProvider } from "../Dialog.context";
import {
  type DialogDefaultState,
  type DialogRef,
  type UseDialogOptions,
  useDialog,
} from "../dialog.useDialog";
import styles from "./drawer.styles";

export type DrawerPropsNative = Omit<JSX.IntrinsicElements["dialog"], "ref">;
export type DrawerPropsCustom = Pick<
  UseDialogOptions,
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

export const Drawer = forwardRef(function Drawer<T extends DialogDefaultState>(
  {
    children,
    dxOrientation = "left-to-right",
    className,
    ...restProps
  }: DrawerProps,
  ref: ForwardedRef<DialogRef<T>>
) {
  const { Portal, dialogRef, dialogState, closeDialog } = useDialog<T>({
    ref,
    type: "modal",
    ...restProps,
  });

  return (
    <Portal>
      <DialogProvider initialState={dialogState} closeDialog={closeDialog}>
        <dialog
          ref={dialogRef}
          className={clsx("drawer", styles, dxOrientation, className)}
        >
          {children}
        </dialog>
      </DialogProvider>
    </Portal>
  );
});
