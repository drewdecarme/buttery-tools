import { makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type DrawerBodyPropsNative = JSX.IntrinsicElements["div"];
export type DrawerBodyPropsCustom = {
  dx?: string;
};
export type DrawerBodyProps = DrawerBodyPropsNative & DrawerBodyPropsCustom;

const SBody = styled("div")`
  padding: 0 ${makeRem(24)};
  overflow: auto;
`;

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  function DrawerBody({ children, className, dx, ...restProps }, ref) {
    return (
      <SBody {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SBody>
    );
  }
);
