import { makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutMainContentPropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainContentProps = LayoutMainContentPropsNative;

const SDiv = styled("div")`
  padding: ${makeRem(32)};
  max-width: ${makeRem(1200)};
  width: 100%;
  margin: 0 auto;
`;

export const LayoutMainContent = forwardRef<
  HTMLDivElement,
  LayoutMainContentProps
>(function LayoutMainContent({ children, className, ...restProps }, ref) {
  return (
    <SDiv {...restProps} className={clsx(className)} ref={ref}>
      <div>{children}</div>
    </SDiv>
  );
});
