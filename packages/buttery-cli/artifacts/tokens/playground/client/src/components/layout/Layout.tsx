import { makeRem } from "@buttery/tokens/docs";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutPropsNative = JSX.IntrinsicElements["div"];
export type LayoutProps = LayoutPropsNative;

const SDiv = styled("div")`
  display: grid;
  grid-template-areas: "layout-nav layout-pane layout-main";
  grid-template-rows: 100vh;
  grid-template-columns: auto ${makeRem(300)} 1fr;
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
