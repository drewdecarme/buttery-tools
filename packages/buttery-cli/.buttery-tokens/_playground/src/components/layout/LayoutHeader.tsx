import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
} from "#buttery/tokens/playground";

export type LayoutHeaderPropsNative = JSX.IntrinsicElements["header"];
export type LayoutHeaderProps = LayoutHeaderPropsNative;

const SHeader = styled("header")`
  grid-area: layout-header;
  padding: 0 ${makeRem(16)};
  display: flex;
  align-items: center;
  border-bottom: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
  position: sticky;
  top: 0;
  background: #fff;

  .title {
    font-family: ${makeFontFamily("body")};
    font-weight: ${makeFontWeight("bold")};
    font-size: ${makeRem(12)};
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
