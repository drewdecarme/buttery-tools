import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";

export type InputLabelPropsNative = JSX.IntrinsicElements["label"];
export type InputLabelPropsCustom = {
  /**
   * The string value that will be displayed as the label
   */
  dxLabel: string;
  /**
   * Optional string to better contextualize the input right below the input
   */
  dxHelp?: string;
  /**
   * An optional size for the label
   * @default "normal"
   */
  dxSize?: "dense" | "normal";
};
export type InputLabelProps = InputLabelPropsNative & InputLabelPropsCustom;

const styles = css`
  display: inline-block;
  vertical-align: top;

  .label {
    font-size: ${makeRem(14)};
    font-weight: ${makeFontWeight("semi-bold")};
    font-family: ${makeFontFamily("body")};
    color: ${makeColor("neutral-dark")};
    margin-bottom: ${makeRem(8)};

    &.dense {
      font-size: ${makeRem(12)};
      margin-bottom: ${makeRem(6)};
    }
  }

  .help {
    margin-top: ${makeRem(4)};
    font-size: ${makeRem(12)};
    color: ${makeColor("neutral-dark", { opacity: 0.8 })};
    font-weight: ${makeFontWeight("regular")};

    &.dense {
      font-size: ${makeRem(10)};
      margin-top: ${makeRem(0)};
    }
  }
`;

export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  function InputLabel(
    { children, className, dxLabel, dxHelp, dxSize = "normal", ...restProps },
    ref
  ) {
    return (
      <label {...restProps} className={classes(styles, className)} ref={ref}>
        <div className={classes("label", dxSize)}>
          <div>{dxLabel}</div>
          {dxHelp && <div className={classes("help", dxSize)}>{dxHelp}</div>}
        </div>
        {children}
      </label>
    );
  }
);
