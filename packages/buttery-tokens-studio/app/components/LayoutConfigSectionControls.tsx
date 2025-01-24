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

import { LayoutConfigSectionTitle } from "./LayoutConfigSectionTitle";

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
  padding: 0 ${makeCustom("layout-gutters")};
  padding-bottom: ${makeCustom("layout-gutters")};
  border-right: ${makeRem(1)} solid
    ${makeColor("neutral-light", { opacity: 0.2 })};
  background-color: #fafafa;

  & > .title {
    gap: ${makeRem(8)};

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
    font-size: ${makeRem(20)};
    font-weight: ${makeFontWeight("Mulish-bold")};
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
      <LayoutConfigSectionTitle>
        <h3>{dxTitle}</h3>
        <button>
          <InformationCircleIcon dxSize={16} />
        </button>
      </LayoutConfigSectionTitle>
      {children}
    </article>
  );
});
