import { makeFontFamily, makeFontWeight, makeRem } from "@buttery/tokens/docs";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutPaneTitlePropsNative = JSX.IntrinsicElements["h2"];
export type LayoutPaneTitleProps = LayoutPaneTitlePropsNative;

const SH2 = styled("h2")`
  font-family: ${makeFontFamily("heading")};
  font-size: ${makeRem(24)};
  font-weight: ${makeFontWeight("semi-bold")};
`;

export const LayoutPaneTitle = forwardRef<
  HTMLHeadingElement,
  LayoutPaneTitleProps
>(function LayoutPaneTitle({ children, className, ...restProps }, ref) {
  return (
    <SH2 {...restProps} className={clsx(className)} ref={ref}>
      {children}
    </SH2>
  );
});
