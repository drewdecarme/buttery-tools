import {
  makeColor,
  makeCustom,
  makeFontFamily,
  makeRem,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";

import { clsx } from "clsx";
import { forwardRef } from "react";

export const bodyStyles = css`
  font-family: ${makeFontFamily("body")};
  margin: 0;

  display: grid;
  min-height: 100vh;
  margin: 0 auto;
  // desktop
  grid-template-rows: ${makeCustom("layout-header-height")} auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    "layout-header"
    "layout-body";

  pre {
    padding: ${makeRem(20)};
    overflow-x: auto;
    border-radius: ${makeRem(8)};
    font-size: ${makeRem(12)};

    .line {
      line-height: 1.5;
    }
  }
  background: ${makeColor("neutral", { variant: "50", opacity: 0.12 })};
`;

export type LayoutPropsNative = JSX.IntrinsicElements["body"];
export type LayoutProps = LayoutPropsNative;

export const Layout = forwardRef<HTMLBodyElement, LayoutProps>(function Layout(
  { children, className, ...restProps },
  ref
) {
  return (
    <body {...restProps} className={clsx(bodyStyles, className)} ref={ref}>
      {children}
    </body>
  );
});
