import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens-local";
import { forwardRef } from "react";

export type LayoutPaneRightSectionPropsNative = JSX.IntrinsicElements["div"];
export type LayoutPaneRightSectionPropsCustom = {
  btTitle?: string;
};
export type LayoutPaneRightSectionProps = LayoutPaneRightSectionPropsNative &
  LayoutPaneRightSectionPropsCustom;

const SDiv = styled("div")`
  &:not(:first-child) {
    border-top: ${localTokens.makeRem(1)} solid
      ${localTokens.makeColor("neutral", {
        variant: "50",
      })};
  }

  h4 {
    font-size: ${localTokens.makeRem(14)};
    font-weight: ${localTokens.makeFontWeight("semi-bold")};
  }
  & + & {
    margin-top: ${localTokens.makeRem(16)};
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
