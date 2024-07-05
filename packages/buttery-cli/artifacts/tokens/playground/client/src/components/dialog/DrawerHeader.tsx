import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeFontWeight, makeRem } from "#buttery/tokens/playground";

export type DrawerHeaderPropsNative = JSX.IntrinsicElements["header"];
export type DrawerHeaderPropsCustom = {
  dxTitle?: string;
};
export type DrawerHeaderProps = DrawerHeaderPropsNative &
  DrawerHeaderPropsCustom;

const SHeader = styled("header")`
  padding: 0 ${makeRem(24)};

  h3 {
    font-size: ${makeRem(24)};
    font-weight: ${makeFontWeight("semi-bold")};
  }
`;

export const DrawerHeader = forwardRef<HTMLElement, DrawerHeaderProps>(
  function DrawerHeader({ children, className, dxTitle, ...restProps }, ref) {
    return (
      <SHeader {...restProps} className={clsx(className)} ref={ref}>
        {dxTitle && <h3>{dxTitle}</h3>}
        {children}
      </SHeader>
    );
  }
);
