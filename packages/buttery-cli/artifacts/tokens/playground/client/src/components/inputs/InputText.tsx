import { makeColor, makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { InputLabel } from "./InputLabel";

export type InputTextPropsNative = JSX.IntrinsicElements["input"];
export type InputTextPropsCustom = {
  /**
   * The size of the input
   * @default `md`
   */
  dxSize?: "sm" | "md" | "lg";
  /**
   * Adds a label to the input
   */
  dxLabel?: string;
};
export type InputTextProps = InputTextPropsNative & InputTextPropsCustom;

const SInput = styled("input")`
  border: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
  background: ${makeColor("neutral", { variant: "50", opacity: 0.4 })};
  border-radius: ${makeRem(8)};
  width: 100%;
  font-size: ${makeRem(16)};

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
`;

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  function InputText(
    {
      children,
      className,
      dxSize = "md",
      type = "text",
      dxLabel,
      ...restProps
    },
    ref
  ) {
    return (
      <InputLabel>
        {dxLabel && <div>{dxLabel}</div>}
        <SInput
          {...restProps}
          className={clsx(className, dxSize)}
          ref={ref}
          type={type}
        />
      </InputLabel>
    );
  }
);
