import { classes } from "@buttery/components";
import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { IconTick04Solid } from "~/icons/IconTick04Solid";

export type InputCheckboxPropsNative = Omit<
  JSX.IntrinsicElements["input"],
  "type"
>;
export type InputCheckboxPropsCustom = {
  dxSize?: "normal" | "big";
};
export type InputCheckboxProps = InputCheckboxPropsNative &
  InputCheckboxPropsCustom;

const styles = css`
  position: relative;
  height: ${makeRem(24)};
  aspect-ratio: 1 / 1;
  display: grid;
  place-content: center;
  border-radius: ${makeRem(4)};
  transition: all 0.1s ease-in-out;
  border: 1px solid transparent;

  &.s {
    &-normal {
      height: ${makeRem(24)};

      span {
        height: ${makeRem(16)};
        width: ${makeRem(16)};
      }
    }
    &-big {
      height: ${makeRem(32)};
      span {
        height: ${makeRem(24)};
        width: ${makeRem(24)};
      }
    }
  }

  input {
    position: absolute;
    margin: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: 1px solid transparent;
    opacity: 0;
    border-radius: ${makeRem(4)};
  }

  span {
    height: ${makeRem(16)};
    width: ${makeRem(16)};
    border-radius: ${makeRem(4)};
    display: block;
    border: 1px solid ${makeColor("neutral-light", { opacity: 0.8 })};
    pointer-events: none;
    transition: all 0.1s ease-in-out;
    display: grid;
    place-content: center;
    & > * {
      opacity: 0;
      transition: inherit;
      color: white;
    }
  }
  &:has(input:checked) {
    span {
      border-color: ${makeColor("secondary-600")};
      background-color: ${makeColor("secondary-600")};

      & > * {
        opacity: 1;
      }
    }
  }
  &:has(input:focus) {
    border-color: ${makeColor("secondary")};
  }
`;

export const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>(
  function InputCheckbox(
    { children, className, dxSize = "normal", ...restProps },
    ref
  ) {
    return (
      <div
        className={classes(styles, {
          [`s-${dxSize}`]: dxSize,
        })}
      >
        <input
          type="checkbox"
          {...restProps}
          className={classes(className)}
          ref={ref}
        />
        <span>
          <IconTick04Solid dxSize={dxSize === "normal" ? 12 : 16} />
        </span>
      </div>
    );
  }
);
