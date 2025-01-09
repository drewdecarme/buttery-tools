import { classes } from "@buttery/components";
import { makeRem, makeColor, makeReset } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type InputTextPropsNative = Omit<JSX.IntrinsicElements["input"], "type">;
export type InputTextPropsCustom = {
  /**
   * A customized type that tells the input what type it should be
   */
  dxType?: "text" | "number";
  dxSize: "dense";
};
export type InputTextProps = InputTextPropsNative & InputTextPropsCustom;

const styles = css`
  ${makeReset("input")};

  &.s-dense {
    height: ${makeRem(28)};
    font-size: ${makeRem(14)};
    border: ${makeRem(1)} solid ${makeColor("neutral", { opacity: 0.1 })};
    border-radius: ${makeRem(2)};
    padding: 0 ${makeRem(8)};
    transition: all 0.1s ease-in-out;
    background: white;

    &:focus {
      border-color: ${makeColor("primary-100")};
    }

    &:disabled {
      background: ${makeColor("neutral-light", { opacity: 0.1 })};
    }
  }
`;

export function createInputTextClassName<T extends { dxSize: "dense" }>({
  dxSize,
}: T) {
  return classes(styles, {
    [`s-${dxSize}`]: dxSize,
  });
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  function InputText(
    { children, className, dxType = "text", dxSize, ...restProps },
    ref
  ) {
    return (
      <input
        {...restProps}
        className={classes(createInputTextClassName({ dxSize }), className)}
        type={dxType}
        ref={ref}
      >
        {children}
      </input>
    );
  }
);
