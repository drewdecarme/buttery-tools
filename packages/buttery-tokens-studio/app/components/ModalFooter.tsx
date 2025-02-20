import { classes } from "@buttery/components";
import { makeCustom, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type ModalFooterPropsNative = JSX.IntrinsicElements["footer"];
export type ModalFooterProps = ModalFooterPropsNative;

export const modalFooterClassName = "modal-footer";

const styles = css`
  display: flex;
  align-items: center;
  gap: ${makeRem(16)};
  height: ${makeRem(80)};
  padding: 0 ${makeCustom("modal-gutters")};
  justify-content: flex-end;
`;

export const ModalFooter = forwardRef<HTMLElement, ModalFooterProps>(
  function ModalFooter({ children, className, ...restProps }, ref) {
    return (
      <footer
        {...restProps}
        className={classes(modalFooterClassName, styles, className)}
        ref={ref}
      >
        {children}
      </footer>
    );
  }
);
