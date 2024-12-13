import type { MouseEventHandler, ReactElement } from "react";
import React, { forwardRef } from "react";
import { css } from "@linaria/core";
import { classes, useToggle } from "@buttery/components";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";

import { IconSettings05 } from "~/icons/IconSettings05";
import { IconDelete } from "~/icons/IconDelete";

export type ColorSwatchPropsNative = Omit<
  JSX.IntrinsicElements["div"],
  "children"
> & {
  children: [ReactElement<HTMLDivElement>, ReactElement<HTMLDivElement>];
};
export type ColorSwatchPropsCustom = {
  dxOnRemove: MouseEventHandler<HTMLButtonElement>;
};
export type ColorSwatchProps = ColorSwatchPropsNative & ColorSwatchPropsCustom;

const styles = css`
  width: 100%;

  & > div {
    padding: ${makeRem(16)} ${makeRem(16)};
  }

  .top {
    padding: ${makeRem(16)} ${makeRem(16)};
    display: grid;
    grid-template-columns: 1fr auto;
    gap: ${makeRem(16)};
    align-items: center;

    &.open {
      padding-bottom: ${makeRem(0)};
    }
  }

  .bottom {
    padding-top: ${makeRem(0)};

    & > {
      div {
        margin-top: ${makeRem(16)};
        padding-top: ${makeRem(16)};
        border-top: ${makeRem(1)} solid
          ${makeColor("neutral-light", { opacity: 0.1 })};
      }
    }
  }
`;

const containerStyles = css`
  display: flex;
  gap: ${makeRem(4)};
`;

const buttonStyles = css`
  ${makeReset("button")};
  border-radius: ${makeRem(4)};
  height: ${makeRem(24)};
  aspect-ratio: 1 / 1;
  display: grid;
  place-content: center;

  &:hover,
  &:focus {
    background: ${makeColor("primary", { opacity: 0.2 })};
    color: ${makeColor("primary-200")};
  }

  &.delete {
    color: ${makeColor("danger-200")};

    &:hover,
    &:focus {
      background: ${makeColor("danger", { opacity: 0.2 })};
      color: ${makeColor("danger-300")};
    }
  }
`;

export const ColorSwatch = forwardRef<HTMLDivElement, ColorSwatchProps>(
  function ColorSwatch({ children, className, dxOnRemove, ...restProps }, ref) {
    const [top, bottom] = React.Children.toArray(children);

    const [isVisible, toggle] = useToggle(false);

    return (
      <div {...restProps} className={classes(styles, className)} ref={ref}>
        <div className={classes("top", { open: isVisible })}>
          {top}
          <div className={containerStyles}>
            <button className={buttonStyles} onClick={toggle}>
              <IconSettings05 dxSize={16} />
            </button>
            <button
              className={classes(buttonStyles, "delete")}
              onClick={dxOnRemove}
            >
              <IconDelete dxSize={16} />
            </button>
          </div>
        </div>
        {isVisible && (
          <div className="bottom">
            <div>{bottom}</div>
          </div>
        )}
      </div>
    );
  }
);
