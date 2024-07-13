import { classes } from "@buttery/components";

import {
  makeColor,
  makeFontFamily,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { forwardRef } from "react";

export type ButtonPropsNative = JSX.IntrinsicElements["button"];
export type ButtonPropsCustom = {
  /**
   * The style of the button
   */
  dxVariant: "primary" | "secondary" | "text";
  /**
   * The size of the button
   * @default `md`
   */
  dxSize?: "sm" | "md" | "lg";
};
export type ButtonProps = ButtonPropsNative & ButtonPropsCustom;

const SButton = styled("button")`
  ${makeReset("button")};
  display: flex;
  gap: ${makeRem(8)};
  border-radius: ${makeRem(24)};
  align-items: center;
  justify-content: center;
  font-family: ${makeFontFamily("body")};
  &:hover {
    cursor: pointer;
  }

  &.sm {
    height: ${makeRem(32)};
    padding: 0 ${makeRem(16)};
  }

  &.md {
    height: ${makeRem(44)};
    padding: 0 ${makeRem(24)};
  }

  &.lg {
    height: ${makeRem(52)};
    padding: 0 ${makeRem(32)};
  }

  &.text {
    background: transparent;
    color: ${makeColor("neutral")};
    &:hover {
      text-decoration: underline;
    }
    &:active {
      text-decoration: underline;
    }
  }

  &.primary {
    background: ${makeColor("primary")};
    color: ${makeColor("neutral")};

    &:hover {
      background: ${makeColor("primary", { variant: "600" })};
    }
    &:active {
      background: ${makeColor("primary", { variant: "700" })};
    }
  }

  &.secondary {
    background: ${makeColor("neutral", { variant: "50" })};
    color: ${makeColor("neutral")};
    &:hover {
      background: ${makeColor("neutral", { variant: "600" })};
      color: white;
    }
    &:active {
      background: ${makeColor("neutral", { variant: "700" })};
      color: white;
    }
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      dxVariant,
      type = "button",
      dxSize = "md",
      ...restProps
    },
    ref
  ) {
    return (
      <SButton
        {...restProps}
        type={type}
        className={classes(className, dxVariant, dxSize)}
        ref={ref}
      >
        {children}
      </SButton>
    );
  }
);
