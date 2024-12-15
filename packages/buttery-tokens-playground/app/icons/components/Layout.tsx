import { classes } from "@buttery/components";
import type { JSX } from "react";
import { forwardRef } from "react";
import { css } from "@linaria/core";
import { makeFontFamily } from "@buttery/tokens/playground";

export type LayoutPropsNative = JSX.IntrinsicElements["body"];
export type LayoutProps = LayoutPropsNative;

const bodyStyles = css`
  margin: 0;
  padding: 0;

  * {
    box-sizing: border-box;
    font-family: ${makeFontFamily("body")};
  }
`;

export const Layout = forwardRef<HTMLBodyElement, LayoutProps>(function Layout(
  { children, className, ...restProps },
  ref
) {
  return (
    <body {...restProps} className={classes(bodyStyles, className)} ref={ref}>
      {children}
    </body>
  );
});
