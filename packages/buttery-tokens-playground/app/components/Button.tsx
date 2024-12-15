import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonPropsNative = JSX.IntrinsicElements["button"];
export type ButtonPropsCustom = {
  /**
   * The style of the button
   * @default contained
   */
  dxVariant?: "contained" | "outlined" | "text";
  /**
   * The size of the button
   * @default normal
   */
  dxSize?: "dense" | "normal";
  /**
   * The color of the button
   * @default primary
   */
  dxColor?: "primary" | "secondary";
  /**
   * A node (typically an icon) to put at the
   * start of the button content
   */
  DXAdornmentStart?: ReactNode;
};
export type ButtonProps = ButtonPropsNative & ButtonPropsCustom;

const styles = css`
  ${makeReset("button")};
  display: flex;
  align-items: center;
  justify-content: center;

  &.v {
    &-contained {
      border-radius: ${makeRem(16)};
      line-height: 1;
      &.c {
        &-primary {
          background: ${makeColor("primary")};
          color: ${makeColor("neutral-dark")};
        }
        &-secondary {
        }
      }
    }
    &-outlined {
      border-radius: ${makeRem(16)};
      line-height: 1;
      &.c {
        &-primary {
          border: ${makeRem(1)} solid ${makeColor("primary")};
          color: ${makeColor("primary-200")};
        }
        &-secondary {
        }
      }
    }
    &-text {
      &.c {
        &-primary {
        }
        &-secondary {
        }
      }
    }
  }

  &.s {
    &-dense {
      height: ${makeRem(24)};
      font-size: ${makeRem(10)};
      padding: 0 ${makeRem(16)};
      gap: ${makeRem(4)};
    }
    &-normal {
      height: ${makeRem(32)};
      font-size: ${makeRem(12)};
      font-weight: ${makeFontWeight("medium")};
      padding: 0 ${makeRem(16)};
      gap: ${makeRem(8)};
    }
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      dxColor = "primary",
      dxVariant = "contained",
      dxSize = "normal",
      DXAdornmentStart = null,
      ...restProps
    },
    ref
  ) {
    return (
      <button
        {...restProps}
        className={classes(
          styles,
          {
            [`c-${dxColor}`]: dxColor,
            [`s-${dxSize}`]: dxSize,
            [`v-${dxVariant}`]: dxVariant,
          },
          className
        )}
        ref={ref}
      >
        {DXAdornmentStart}
        {children}
      </button>
    );
  }
);
