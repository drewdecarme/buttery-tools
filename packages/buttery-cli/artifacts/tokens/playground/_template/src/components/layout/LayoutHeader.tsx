import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeColor, makeRem } from "#buttery/tokens/playground";

export type LayoutHeaderPropsNative = JSX.IntrinsicElements["header"];
export type LayoutHeaderPropsCustom = Record<string, unknown>;
export type LayoutHeaderProps = LayoutHeaderPropsNative &
  LayoutHeaderPropsCustom;

const SHeader = styled("header")`
  grid-area: layout-header;
  padding: 0 ${makeRem(16)};
  display: flex;
  align-items: center;
  border-bottom: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
  position: sticky;
  top: 0;
  background: #fff;
  justify-content: space-between;

  & > div {
    display: flex;
    align-items: center;
    gap: ${makeRem(16)};

    &:last-child {
      a {
        height: ${makeRem(24)};
        color: ${makeColor("neutral")};
      }
    }
  }
`;

export const LayoutHeader = forwardRef<HTMLElement, LayoutHeaderProps>(
  function LayoutHeader(
    { children, className, btLogoAlt, btLogoSrc, ...restProps },
    ref
  ) {
    return (
      <SHeader {...restProps} className={clsx(className)} ref={ref}>
        <div />
        <div>{children}</div>
      </SHeader>
    );
  }
);
