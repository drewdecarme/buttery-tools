import { clsx } from "clsx";
import { forwardRef } from "react";

export type VersionHistoryPropsNative = JSX.IntrinsicElements["div"];
export type VersionHistoryProps = VersionHistoryPropsNative;

export const VersionHistory = forwardRef<HTMLDivElement, VersionHistoryProps>(
  function VersionHistory({ children, className, ...restProps }, ref) {
    return (
      <div {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </div>
    );
  }
);
