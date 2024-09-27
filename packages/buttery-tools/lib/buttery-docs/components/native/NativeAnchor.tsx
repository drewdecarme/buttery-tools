import { clsx } from "clsx";
import { forwardRef } from "react";

export type NativeAnchorPropsNative = JSX.IntrinsicElements["a"];
export type NativeAnchorProps = NativeAnchorPropsNative;

export const NativeAnchor = forwardRef<HTMLAnchorElement, NativeAnchorProps>(
  function NativeAnchor({ children, className, ...restProps }, ref) {
    return (
      <a {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </a>
    );
  }
);
