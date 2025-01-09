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

import type { ButtonSharedProps } from "./button.utils";

export type ButtonRegularPropsNative = JSX.IntrinsicElements["button"];
export type ButtonRegularPropsCustom = ButtonSharedProps & {
  /**
   * The style of the button
   * @default contained
   */
  dxVariant: "contained" | "outlined" | "text";
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
export type ButtonRegularProps = ButtonRegularPropsNative &
  ButtonRegularPropsCustom;

const styles = css`
  ${makeReset("button")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.v {
    &-contained {
      border-radius: ${makeRem(8)};
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
      border-radius: ${makeRem(8)};
      line-height: 1;
      &.c {
        &-primary {
          border: ${makeRem(1)} solid ${makeColor("primary-600")};
          color: ${makeColor("primary-600")};
          &:hover {
            color: ${makeColor("primary-900")};
          }
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
          color: ${makeColor("secondary-800")};
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
    &-big {
      height: ${makeRem(44)};
      font-size: ${makeRem(14)};
      font-weight: ${makeFontWeight("medium")};
      padding: 0 ${makeRem(20)};
      gap: ${makeRem(10)};
    }
  }
`;

export function createButtonClassNames({
  dxColor,
  dxVariant,
  dxSize,
}: Required<Omit<ButtonRegularPropsCustom, "DXAdornmentStart">>): string {
  return classes({
    [`c-${dxColor}`]: dxColor,
    [`s-${dxSize}`]: dxSize,
    [`v-${dxVariant}`]: dxVariant,
  });
}

export function createButtonStyles(
  args: Required<Omit<ButtonRegularPropsCustom, "DXAdornmentStart">>
): string {
  return classes(styles, createButtonClassNames(args));
}

export const ButtonRegular = forwardRef<HTMLButtonElement, ButtonRegularProps>(
  function ButtonRegular(
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
        ref={ref}
        className={classes(
          createButtonStyles({ dxColor, dxSize, dxVariant }),
          className
        )}
      >
        {DXAdornmentStart}
        {children}
      </button>
    );
  }
);
