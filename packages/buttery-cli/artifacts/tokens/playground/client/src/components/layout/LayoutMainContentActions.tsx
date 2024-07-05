import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeColor, makeRem } from "#buttery/tokens/playground";

export type LayoutMainContentActionsPropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainContentActionsPropsCustom = Record<string, unknown>;
export type LayoutMainContentActionsProps =
  LayoutMainContentActionsPropsNative & LayoutMainContentActionsPropsCustom;

const SDiv = styled("div")`
  width: 100%;
  height: ${makeRem(44)};
  padding: ${makeRem(8)};
  background: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
`;

export const LayoutMainContentActions = forwardRef<
  HTMLDivElement,
  LayoutMainContentActionsProps
>(function LayoutMainContentActions(
  { children, className, ...restProps },
  ref
) {
  return (
    <SDiv {...restProps} className={clsx(className)} ref={ref}>
      {children}
    </SDiv>
  );
});
