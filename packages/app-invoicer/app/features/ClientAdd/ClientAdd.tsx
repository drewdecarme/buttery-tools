import { forwardRef } from "react";
import { clsx } from "clsx";
import { DialogRef } from "@buttery/components";
import { Drawer } from "../../components/dialog";

export type ClientAddPropsNative = Pick<
  JSX.IntrinsicElements["dialog"],
  "className" | "children"
>;
export type ClientAddPropsCustom = {};
export type ClientAddProps = ClientAddPropsNative & ClientAddPropsCustom;

export const ClientAdd = forwardRef<DialogRef, ClientAddProps>(
  function ClientAdd({ children, className, ...restProps }, ref) {
    return (
      <Drawer
        {...restProps}
        className={clsx(className)}
        ref={ref}
        dxOrientation="right-to-left"
        dxSize="lg"
      >
        hello
      </Drawer>
    );
  }
);
