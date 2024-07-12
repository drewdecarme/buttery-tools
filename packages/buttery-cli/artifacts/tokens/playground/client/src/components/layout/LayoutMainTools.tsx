import { makeColor, makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutMainToolsPropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainToolsPropsCustom = Record<string, unknown>;
export type LayoutMainToolsProps = LayoutMainToolsPropsNative &
  LayoutMainToolsPropsCustom;

const SDiv = styled("div")`
  width: 100%;
  height: 100%;
  padding: ${makeRem(32)};
  background: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
`;

export const LayoutMainTools = forwardRef<HTMLDivElement, LayoutMainToolsProps>(
  function LayoutMainTools({ children, className, ...restProps }, ref) {
    return (
      <SDiv {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SDiv>
    );
  }
);
