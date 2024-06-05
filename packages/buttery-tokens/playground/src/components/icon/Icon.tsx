import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { Suspense, forwardRef, lazy } from "react";
import { localTokens } from "../../tokens-local";
import type { IconNames } from "./icon.types";
import { type Color, makeColor } from ".tokens/_tokens/makeColor";

export type IconPropsNative = JSX.IntrinsicElements["div"];
export type IconPropsCustom = {
  icon: IconNames;
  /**
   * The height and width of the icon
   * @default 24
   */
  ddSize?: number;
  /**
   * The color of the icon
   * @default inherit
   */
  ddColor?: Color;
};
export type IconProps = IconPropsNative & IconPropsCustom;

const SIconContainer = styled("div")`
  display: grid;
  place-content: center;
  width: var(--icon-size);
  height: var(--icon-size);
  
  svg {
    width: inherit;
    height: inherit;
  }
`;

export const Icon = forwardRef<HTMLDivElement, IconProps>(function Icon(
  { children, className, icon, ddSize = 24, ddColor, ...restProps },
  ref
) {
  const IconComponent = lazy(
    () => import(`../../../assets/icons/react/${icon}.tsx`)
  );

  return (
    <SIconContainer
      {...restProps}
      className={clsx(className)}
      style={{
        // @ts-ignore
        "--icon-size": localTokens.makeRem(ddSize),
        color: ddColor ? makeColor(ddColor) : "inherit"
      }}
      ref={ref}
    >
      <Suspense fallback={<div>...</div>}>
        <IconComponent />
      </Suspense>
    </SIconContainer>
  );
});
