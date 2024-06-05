import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens-local";
import { forwardRef } from "react";

export type LayoutMainPropsNative = JSX.IntrinsicElements["main"];
export type LayoutMainProps = LayoutMainPropsNative;

const SMain = styled("main")`
  grid-area: layout-main;
  display: grid;
  gap: ${localTokens.makeRem(16)};
  grid-template-columns: ${localTokens.makeRem(300)} 1fr ${localTokens.makeRem(
      300
    )};
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
