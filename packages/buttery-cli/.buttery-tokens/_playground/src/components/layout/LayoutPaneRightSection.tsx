import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeColor, makeFontWeight, makeRem } from "#buttery/tokens/playground";

export type LayoutPaneRightSectionPropsNative = JSX.IntrinsicElements["div"];
export type LayoutPaneRightSectionPropsCustom = {
  btTitle?: string;
};
export type LayoutPaneRightSectionProps = LayoutPaneRightSectionPropsNative &
  LayoutPaneRightSectionPropsCustom;

const SDiv = styled("div")`
  &:not(:first-child) {
    border-top: ${makeRem(1)} solid
      ${makeColor("neutral", {
        variant: "50",
      })};
  }

  h4 {
    font-size: ${makeRem(14)};
    font-weight: ${makeFontWeight("semi-bold")};
  }
  & + & {
    margin-top: ${makeRem(16)};
  }
`;

export const LayoutPaneRightSection = forwardRef<
  HTMLDivElement,
  LayoutPaneRightSectionProps
>(function LayoutPaneRightSection(
  { children, className, btTitle, ...restProps },
  ref
) {
  return (
    <SDiv {...restProps} className={clsx(className)} ref={ref}>
      {btTitle && <h4>{btTitle}</h4>}
      <div>{children}</div>
    </SDiv>
  );
});
