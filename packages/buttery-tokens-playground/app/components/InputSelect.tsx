import { classes } from "@buttery/components";
import { makeRem, makeColor, makeReset } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type InputSelectPropsNative = JSX.IntrinsicElements["select"];
export type InputSelectPropsCustom = {
  dxSize: "dense";
};
export type InputSelectProps = InputSelectPropsNative & InputSelectPropsCustom;

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
      <select
        {...restProps}
        className={classes(styles, className, {
          [`s-${dxSize}`]: dxSize,
        })}
        ref={ref}
      >
        {children}
      </select>
    );
  }
);
