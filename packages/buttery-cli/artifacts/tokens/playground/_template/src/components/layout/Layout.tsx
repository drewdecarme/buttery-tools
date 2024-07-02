import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeRem } from "#buttery/tokens/playground";

export type LayoutPropsNative = JSX.IntrinsicElements["div"];
export type LayoutProps = LayoutPropsNative;

const SDiv = styled("div")`
  display: grid;
  grid-template-areas:
    "layout-side-nav layout-header"
    "layout-side-nav   layout-main";
  grid-template-rows: ${makeRem(60)} 100vh;
  grid-template-columns: auto 1fr;
`;

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(function Layout(
  { children, className, ...restProps },
  ref
) {
  return (
    <SDiv {...restProps} className={clsx(className)} ref={ref}>
      {children}
    </SDiv>
  );
});
