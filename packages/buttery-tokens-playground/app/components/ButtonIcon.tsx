import { classes, useForwardedRef } from "@buttery/components";
import { css } from "@linaria/core";
import type { JSX, RefCallback } from "react";
import { forwardRef, useCallback, useId } from "react";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import { match } from "ts-pattern";

import type { IconBrush } from "~/icons/IconBrush";

import type { ButtonSharedProps } from "./button.utils";
import { Tooltip, useTooltip } from "./Tooltip";

export type ButtonIconPropsNative = Omit<
  JSX.IntrinsicElements["button"],
  "children"
>;
export type ButtonIconPropsCustom = ButtonSharedProps & {
  dxVariant: "icon";
  /**
   * The style of the icon button
   * @default normal
   */
  dxStyle?: "normal" | "outlined";
  DXIcon: typeof IconBrush;
  /**
   * Optional text that is used to describe button
   * with a tooltip
   */
  dxHelp?: string;
};
export type ButtonIconProps = ButtonIconPropsNative & ButtonIconPropsCustom;

const styles = css`
  ${makeReset("button")};

  aspect-ratio: 1 / 1;
  display: grid;
  place-content: center;
  border-radius: ${makeRem(4)};
  transition: all 0.15s ease-in-out;
  background: transparent;
  border: ${makeRem(1)} solid transparent;
  cursor: pointer;

  &:hover,
  &:focus {
    outline: none;
    border-color: ${makeColor("neutral-light", { opacity: 0.5 })};
  }
  &:active {
    scale: 0.9;
  }
  &.active {
    background: ${makeColor("neutral-light", { opacity: 0.2 })};
    border-color: ${makeColor("neutral-light", { opacity: 0.5 })};
  }

  svg {
    color: inherit;
  }

  &.s {
    &-dense {
      height: ${makeRem(24)};
    }
    &-normal {
      height: ${makeRem(32)};
    }
    &-big {
      height: ${makeRem(44)};
    }
  }

  &.st {
    &-outlined {
      border-color: ${makeColor("neutral-light", { opacity: 0.3 })};
    }
  }
`;

const helpStyles = css`
  white-space: nowrap;
`;

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  function ButtonIcon(
    {
      className,
      dxHelp,
      DXIcon,
      dxSize = "normal",
      dxStyle = "normal",
      ...restProps
    },
    forwardedRef
  ) {
    const { setTargetRef, setTooltipRef } = useTooltip({
      dxType: "tooltip",
      dxPosition: "top-center",
      dxArrow: { size: 8 },
    });
    const ref = useForwardedRef(forwardedRef);
    const id = useId();
    const refCallback = useCallback<RefCallback<HTMLButtonElement>>(
      (node) => {
        if (!node) return;
        ref.current = node;
        setTargetRef(node);
      },
      [ref, setTargetRef]
    );

    return (
      <>
        <button
          {...restProps}
          aria-labelledby={id}
          className={classes(styles, className, {
            [`s-${dxSize}`]: dxSize,
            [`st-${dxStyle}`]: dxStyle,
          })}
          ref={refCallback}
        >
          <DXIcon
            dxSize={match(dxSize)
              .with("dense", () => 16)
              .with("normal", () => 20)
              .with("big", () => 28)
              .exhaustive()}
          />
        </button>
        {dxHelp && (
          <Tooltip ref={setTooltipRef} className={helpStyles} id={id}>
            {dxHelp}
          </Tooltip>
        )}
      </>
    );
  }
);
