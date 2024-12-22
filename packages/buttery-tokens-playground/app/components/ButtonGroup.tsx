import { classes } from "@buttery/components";
import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type ButtonGroupPropsNative = JSX.IntrinsicElements["div"];
export type ButtonGroupProps = ButtonGroupPropsNative;

const styles = css`
  display: flex;
  gap: 0;

  & > button,
  & > div {
    border-radius: 0 !important;

    &:not(:last-child) {
      border-right: 0 !important;

      & > button {
        &:nth-child(2) {
          border-right: 0;
        }
      }
    }
    &:first-child {
      border-top-left-radius: ${makeRem(4)} !important;
      border-bottom-left-radius: ${makeRem(4)} !important;

      & > button {
        &:nth-child(1) {
          border-top-left-radius: ${makeRem(4)} !important;
          border-bottom-left-radius: ${makeRem(4)} !important;
        }
        &:nth-child(2) {
          border-radius: 0;
        }
      }
    }
    &:last-child {
      border-top-right-radius: ${makeRem(4)} !important;
      border-bottom-right-radius: ${makeRem(4)} !important;

      & > button {
        &:nth-child(1) {
          border-radius: 0;
        }
        &:nth-child(2) {
          border-top-right-radius: ${makeRem(4)} !important;
          border-bottom-right-radius: ${makeRem(4)} !important;
        }
      }
    }
  }
`;

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ children, className, ...restProps }, ref) {
    return (
      <div {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </div>
    );
  }
);
