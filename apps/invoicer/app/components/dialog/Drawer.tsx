import { forwardRef } from "react";
import { clsx } from "clsx";
import {
  Drawer as ButteryDrawer,
  type DrawerProps as ButteryDrawerProps,
  DialogRef,
} from "@buttery/components";
import { css } from "@linaria/core";
export { useDrawer } from "@buttery/components";

export type DrawerProps = ButteryDrawerProps & {
  dxSize?: "sm" | "md" | "lg";
};

const styles = css`
  &.right-to-left {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  &.sm {
    --drawer-width: 20%;
  }
  &.md {
    --drawer-width: 40%;
  }
  &.lg {
    --drawer-width: 60%;
  }
`;

export const Drawer = forwardRef<DialogRef, DrawerProps>(function Drawer(
  { children, className, dxSize = "sm", ...restProps },
  ref
) {
  return (
    <ButteryDrawer
      {...restProps}
      className={clsx(styles, dxSize, className)}
      ref={ref}
    >
      {children}
    </ButteryDrawer>
  );
});
