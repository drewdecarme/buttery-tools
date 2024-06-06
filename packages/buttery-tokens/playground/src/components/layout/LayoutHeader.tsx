import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens/tokens-local";
import { forwardRef } from "react";
import { makeColor } from ".tokens/_tokens/makeColor";

export type LayoutHeaderPropsNative = JSX.IntrinsicElements["header"];
export type LayoutHeaderProps = LayoutHeaderPropsNative;

const SHeader = styled("header")`
  grid-area: layout-header;
  padding: 0 ${localTokens.makeRem(16)};
  display: flex;
  align-items: center;
  border-bottom: ${localTokens.makeRem(1)} solid
    ${localTokens.makeColor("neutral", { variant: "50" })};
  position: sticky;
  top: 0;
  background: #fff;

  .title {
    font-family: ${localTokens.makeFontFamily("body")};
    font-weight: ${localTokens.makeFontWeight("bold")};
    font-size: ${localTokens.makeRem(12)};
    text-transform: uppercase;
  }
`;

export const LayoutHeader = forwardRef<HTMLElement, LayoutHeaderProps>(
  function LayoutHeader({ children, className, ...restProps }, ref) {
    return (
      <SHeader {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SHeader>
    );
  }
);
