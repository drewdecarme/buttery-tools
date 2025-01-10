import { classes } from "@buttery/components";
import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type VariantEmptyPropsNative = JSX.IntrinsicElements["div"];
export type VariantEmptyPropsCustom = {
  dxMessage: string;
};
export type VariantEmptyProps = VariantEmptyPropsNative &
  VariantEmptyPropsCustom;

const styles = css`
  padding: ${makeRem(16)};
  width: 100%;
  display: grid;
  grid-template-rows: auto auto;
  gap: ${makeRem(8)};
  justify-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: ${makeRem(4)};
  border: 1px dashed ${makeColor("neutral-light", { opacity: 0.2 })};

  .message {
    padding: ${makeRem(8)};
    color: ${makeColor("neutral-dark")};
    font-size: ${makeRem(14)};
  }
`;

export const VariantEmpty = forwardRef<HTMLDivElement, VariantEmptyProps>(
  function VariantEmpty({ children, className, dxMessage, ...restProps }, ref) {
    return (
      <div {...restProps} className={classes(styles, className)} ref={ref}>
        <div className="message">{dxMessage}</div>
        <div>{children}</div>
      </div>
    );
  }
);
