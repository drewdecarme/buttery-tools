import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeRem } from "#buttery/tokens/config-ui";

export type LayoutMainPropsNative = JSX.IntrinsicElements["main"];
export type LayoutMainProps = LayoutMainPropsNative;

const SMain = styled("main")`
  grid-area: layout-main;
  display: grid;
  gap: ${makeRem(16)};
  grid-template-columns: ${makeRem(300)} 1fr ${makeRem(300)};
  width: 100%;
`;

export const LayoutMain = forwardRef<HTMLElement, LayoutMainProps>(
  function LayoutMain({ children, className, ...restProps }, ref) {
    return (
      <SMain {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SMain>
    );
  }
);
