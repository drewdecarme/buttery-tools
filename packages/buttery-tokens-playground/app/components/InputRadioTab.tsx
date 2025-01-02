import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type InputRadioTabPropsNative = JSX.IntrinsicElements["input"];
export type InputRadioTabPropsCustom = {
  dxSize: "dense" | "normal" | "big";
  dxLabel: string;
  dxSubLabel?: string;
};
export type InputRadioTabProps = InputRadioTabPropsNative &
  InputRadioTabPropsCustom;

const styles = css`
  display: grid;
  place-content: center;
  width: 100%;
  font-family: ${makeFontFamily("body")};
  text-align: center;
  z-index: 2;

  &:has(input:checked) {
    .r-label {
      font-weight: ${makeFontWeight("bold")};
    }
  }

  &.s {
    &-dense {
      padding: ${makeRem(8)} 0;
      min-height: ${makeRem(32)};

      .r-label {
        font-size: ${makeRem(12)};
      }

      .sub-label {
        font-size: ${makeRem(10)};
        color: ${makeColor("neutral-light", { opacity: 0.5 })};
      }
    }
    &-normal {
      font-size: ${makeRem(16)};
    }
    &-big {
      font-size: ${makeRem(20)};
    }
  }

  input {
    ${makeReset("input")};
  }
`;

export const InputRadioTab = forwardRef<HTMLInputElement, InputRadioTabProps>(
  function InputRadioTab(
    { children, className, dxSize, dxLabel, dxSubLabel, ...restProps },
    ref
  ) {
    return (
      <label
        className={classes(
          styles,
          {
            [`s-${dxSize}`]: dxSize,
          },
          className
        )}
      >
        <input {...restProps} type="radio" ref={ref} />
        <div className="r-label">{dxLabel}</div>
        {dxSubLabel && <div className="sub-label">{dxSubLabel}</div>}
      </label>
    );
  }
);
