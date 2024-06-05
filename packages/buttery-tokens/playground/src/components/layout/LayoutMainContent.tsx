import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutMainContentPropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainContentProps = LayoutMainContentPropsNative;

export const LayoutMainContent = forwardRef<
  HTMLDivElement,
  LayoutMainContentProps
>(function LayoutMainContent({ children, className, ...restProps }, ref) {
  return (
    <div {...restProps} className={clsx(className)} ref={ref}>
      {children}
    </div>
  );
});
