import { type ForwardedRef, forwardRef } from "react";

import type { ModalDefaultState, ModalRef } from "../../hooks";
import { classes } from "../../utils";
import { Modal, type ModalPropsCustom, type ModalPropsNative } from "../Modal";

export type DrawerPropsNative = ModalPropsNative;
export type DrawerPropsCustom = ModalPropsCustom & {
  dxOrientation?: "slide-left" | "slide-right" | "slide-down" | "slide-up";
};
export type DrawerProps = DrawerPropsNative & DrawerPropsCustom;

export const Drawer = forwardRef(function Drawer<T extends ModalDefaultState>(
  {
    children,
    dxOrientation = "slide-left",
    className,
    ...restProps
  }: DrawerProps,
  ref: ForwardedRef<ModalRef<T>>
) {
  return (
    <Modal
      {...restProps}
      className={classes("drawer", dxOrientation, className)}
      // @ts-expect-error The ref's matchup however TS doesn't like the fact that you
      // can instantiate it with a different state. We're not concerned with this since
      // we're only using this component as a ref proxy and don't care about the types
      // internally to this component
      ref={ref}
    >
      {children}
    </Modal>
  );
});
