import { classes } from "@buttery/components";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type InputColorPropsNative = Omit<
  JSX.IntrinsicElements["input"],
  "type"
>;
export type InputColorPropsCustom = {
  dxSize: "dense";
};
export type InputColorProps = InputColorPropsNative & InputColorPropsCustom;

const styles = css`
  ${makeReset("input")};

  /* Add custom styling for the color picker circle */
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
  }

  /* Adjustments for non-Webkit browsers */
  &::-moz-color-swatch {
    border: none;
  }

  &.s-dense {
    border-radius: ${makeRem(2)};
    height: ${makeRem(24)};
    aspect-ratio: 1 / 1;
  }
`;

export const InputColor = forwardRef<HTMLInputElement, InputColorProps>(
  function InputColor({ children, className, dxSize, ...restProps }, ref) {
    return (
      <input
        {...restProps}
        type="color"
        className={classes(styles, className, {
          [`s-${dxSize}`]: dxSize,
        })}
        ref={ref}
      >
        {children}
      </input>
    );
  }
);
