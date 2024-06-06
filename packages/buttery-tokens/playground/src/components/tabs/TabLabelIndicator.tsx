import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type TabLabelIndicatorPropsNative = JSX.IntrinsicElements["div"];
export type TabLabelIndicatorProps = TabLabelIndicatorPropsNative;

const SDiv = styled("div")``;

export const TabLabelIndicator = forwardRef<
  HTMLDivElement,
  TabLabelIndicatorProps
>(function TabLabelIndicator({ children, className, ...restProps }, ref) {
  return (
    <SDiv {...restProps} className={clsx(className)} ref={ref}>
      {children}
    </SDiv>
  );
});
