import { classes } from "@buttery/components";
import { makeCustom } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type ModalBodyPropsNative = JSX.IntrinsicElements["div"];
export type ModalBodyPropsCustom = {
  dxNoGutters?: boolean;
};
export type ModalBodyProps = ModalBodyPropsNative & ModalBodyPropsCustom;

const styles = css`
  padding: 0 ${makeCustom("modal-gutters")};
`;

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  function ModalBody({ children, className, ...restProps }, ref) {
    return (
      <div {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </div>
    );
  }
);
