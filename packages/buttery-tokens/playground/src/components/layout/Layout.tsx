import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens/tokens-local";
import { forwardRef } from "react";

export type LayoutPropsNative = JSX.IntrinsicElements["div"];
export type LayoutProps = LayoutPropsNative;

const SDiv = styled("div")`
  display: grid;
  grid-template-areas:
    "layout-side-nav  layout-header"
    "layout-side-nav   layout-main"
    "layout-side-nav  layout-footer";
  grid-template-rows: ${localTokens.makeRem(64)} 100vh auto;
  grid-template-columns: ${localTokens.makeRem(80)} 1fr;
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
