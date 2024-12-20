import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
  type ColorAndVariants,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { forwardRef } from "react";
import { match } from "ts-pattern";

import type { IconArrowDown } from "~/icons/IconArrowDown";

export type LabelPropsNative = JSX.IntrinsicElements["span"];
export type LabelPropsCustom = {
  children: string;
  dxSize?: "dense" | "normal" | "large";
  dxColor?: ColorAndVariants;
  DXIconStart?: typeof IconArrowDown;
};
export type LabelProps = LabelPropsNative & LabelPropsCustom;

const styles = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: ${makeFontFamily("body")};
  background: var(--bg-color);
  line-height: 1;
  font-weight: ${makeFontWeight("semi-bold")};
  white-space: nowrap;
  border-radius: ${makeRem(4)};

  &.s {
    &-dense {
      padding: 0 ${makeRem(8)};
      height: ${makeRem(20)};
      font-size: ${makeRem(10)};
      gap: ${makeRem(6)};
    }
  }

  &.s {
    &-normal {
      padding: 0 ${makeRem(10)};
      height: ${makeRem(24)};
      font-size: ${makeRem(12)};
      gap: ${makeRem(8)};
    }
  }

  &.s {
    &-large {
      padding: 0 ${makeRem(12)};
      height: ${makeRem(28)};
      font-size: ${makeRem(14)};
      gap: ${makeRem(12)};
    }
  }
`;

export const Label = forwardRef<HTMLSpanElement, LabelProps>(function Label(
  {
    children,
    className,
    DXIconStart,
    dxSize = "normal",
    dxColor = "neutral",
    ...restProps
  },
  ref
) {
  return (
    <span
      {...restProps}
      className={classes(styles, { [`s-${dxSize}`]: dxSize }, className)}
      style={{
        // @ts-expect-error CSS doesn't like custom properties but this works well
        ["--bg-color"]: makeColor(dxColor),
      }}
      ref={ref}
    >
      {DXIconStart && (
        <DXIconStart
          dxSize={match(dxSize)
            .with("dense", () => 10)
            .with("normal", () => 12)
            .with("large", () => 14)
            .exhaustive()}
        />
      )}
      {children}
    </span>
  );
});
