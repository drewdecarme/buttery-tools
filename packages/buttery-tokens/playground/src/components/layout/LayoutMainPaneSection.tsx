import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens/tokens-local";
import { forwardRef } from "react";

export type LayoutMainPaneSectionPropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainPaneSectionPropsCustom = {
  btTitle?: string;
  btSubtitle?: string;
};
export type LayoutMainPaneSectionProps = LayoutMainPaneSectionPropsNative &
  LayoutMainPaneSectionPropsCustom;

const SDiv = styled("div")`
  padding: ${localTokens.makeRem(16)} 0;

  &:not(:first-child) {
    border-top: ${localTokens.makeRem(1)} solid
      ${localTokens.makeColor("neutral", {
        variant: "50",
      })};
  }

  .title {
    margin-bottom: ${localTokens.makeRem(20)};

    h4 {
      font-size: ${localTokens.makeRem(14)};
      font-weight: ${localTokens.makeFontWeight("semi-bold")};
      text-transform: capitalize;
      margin: 0;
    }
    p {
      font-size: ${localTokens.makeRem(12)};
      margin: 0;
    }
  }

  & + & {
    margin-top: ${localTokens.makeRem(16)};
  }
`;

export const LayoutMainPaneSection = forwardRef<
  HTMLDivElement,
  LayoutMainPaneSectionProps
>(function LayoutMainPaneSection(
  { children, className, btTitle, btSubtitle, ...restProps },
  ref
) {
  return (
    <SDiv {...restProps} className={clsx(className)} ref={ref}>
      <div className="title">
        {btTitle && <h4>{btTitle}</h4>}
        {btSubtitle && <p>{btSubtitle}</p>}
      </div>

      <div>{children}</div>
    </SDiv>
  );
});
