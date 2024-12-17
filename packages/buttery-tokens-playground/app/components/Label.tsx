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

  &.s {
    &-dense {
      padding: 0 ${makeRem(16)};
      height: ${makeRem(24)};
      font-size: ${makeRem(12)};
      border-radius: ${makeRem(16)};
      gap: ${makeRem(6)};
    }
  }

  &.s {
    &-normal {
      padding: 0 ${makeRem(20)};
      height: ${makeRem(28)};
      font-size: ${makeRem(14)};
      border-radius: ${makeRem(20)};
      gap: ${makeRem(8)};
    }
  }

  &.s {
    &-large {
      padding: 0 ${makeRem(24)};
      height: ${makeRem(32)};
      font-size: ${makeRem(16)};
      border-radius: ${makeRem(24)};
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
        ["--bg-color"]: makeColor(dxColor, { opacity: 0.25 }),
      }}
      ref={ref}
    >
      {DXIconStart && (
        <DXIconStart
          dxSize={match(dxSize)
            .with("dense", () => 12)
            .with("normal", () => 16)
            .with("large", () => 20)
            .exhaustive()}
        />
      )}
      {children}
    </span>
  );
});
