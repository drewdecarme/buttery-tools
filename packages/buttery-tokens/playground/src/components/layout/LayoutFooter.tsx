import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutFooterPropsNative = JSX.IntrinsicElements["footer"];
export type LayoutFooterProps = LayoutFooterPropsNative;

const SFooter = styled("footer")`
  grid-area: layout-footer;
`;

export const LayoutFooter = forwardRef<HTMLElement, LayoutFooterProps>(
  function LayoutFooter({ children, className, ...restProps }, ref) {
    return (
      <SFooter {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SFooter>
    );
  }
);
