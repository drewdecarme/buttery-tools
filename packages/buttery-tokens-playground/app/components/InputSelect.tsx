import { classes } from "@buttery/components";
import { makeRem, makeColor, makeReset } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { ArrowDown01Icon } from "~/icons/IconArrowDown";

export type InputSelectPropsNative = JSX.IntrinsicElements["select"];
export type InputSelectPropsCustom = {
  dxSize: "dense";
};
export type InputSelectProps = InputSelectPropsNative & InputSelectPropsCustom;

const divStyles = css`
  position: relative;

  .icon {
    position: absolute;
    right: 0;
    z-index: 10;
    top: 50%;
  }

  &:has(.s-dense) {
    .icon {
      margin-top: -${makeRem(6)};
      right: ${makeRem(6)};
    }
  }
`;

const styles = css`
  ${makeReset("input")};

  &.s-dense {
    height: ${makeRem(24)};
    font-size: ${makeRem(12)};
    border: ${makeRem(1)} solid ${makeColor("neutral", { opacity: 0.1 })};
    border-radius: ${makeRem(2)};
    padding: 0 ${makeRem(8)};
    transition: all 0.1s ease-in-out;

    &:focus {
      border-color: ${makeColor("primary-100")};
    }
  }
`;

export const InputSelect = forwardRef<HTMLSelectElement, InputSelectProps>(
  function InputSelect({ children, className, dxSize, ...restProps }, ref) {
    return (
      <div className={divStyles}>
        <select
          {...restProps}
          className={classes(styles, className, {
            [`s-${dxSize}`]: dxSize,
          })}
          ref={ref}
        >
          {children}
        </select>
        <ArrowDown01Icon dxSize={12} className="icon" />
      </div>
    );
  }
);
