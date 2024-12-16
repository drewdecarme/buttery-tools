import { classes } from "@buttery/components";
import {
  makeColor,
  makeCustom,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX, ReactNode } from "react";
import { forwardRef } from "react";

import { InformationCircleIcon } from "~/icons/IconInformationCircle";

export type LayoutConfigSectionControlsPropsNative =
  JSX.IntrinsicElements["article"];
export type LayoutConfigSectionControlsPropsCustom = {
  dxTitle: string;
  dxDescription: ReactNode;
};
export type LayoutConfigSectionControlsProps =
  LayoutConfigSectionControlsPropsNative &
    LayoutConfigSectionControlsPropsCustom;

const styles = css`
  padding-right: ${makeRem(32)};
  border-right: ${makeRem(1)} solid
    ${makeColor("neutral-light", { opacity: 0.2 })};

  & > .title {
    display: flex;
    align-items: center;
    gap: ${makeRem(8)};
    position: sticky;
    top: 158px;
    background: white;
    padding-top: ${makeCustom("layout-section-offset-top")};
    padding-bottom: ${makeRem(24)};
    z-index: 10;

    h3 {
      margin: 0;
    }

    button {
      ${makeReset("button")};
      height: ${makeRem(24)};
      aspect-ratio: 1 / 1;
      display: grid;
      place-content: center;
    }
  }

  h3 {
    margin: 0;
    font-size: ${makeRem(16)};
    font-weight: ${makeFontWeight("bold")};
  }
`;

export const LayoutConfigSectionControls = forwardRef<
  HTMLElement,
  LayoutConfigSectionControlsProps
>(function LayoutConfigSectionControls(
  { children, className, dxTitle, dxDescription: _, ...restProps },
  ref
) {
  return (
    <article {...restProps} className={classes(styles, className)} ref={ref}>
      <div className="title">
        <h3>{dxTitle}</h3>
        <button>
          <InformationCircleIcon dxSize={16} />
        </button>
      </div>
      {children}
    </article>
  );
});
