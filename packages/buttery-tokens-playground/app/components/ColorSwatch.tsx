import type { MouseEventHandler, ReactElement } from "react";
import React, { forwardRef } from "react";
import { css } from "@linaria/core";
import { classes, useToggle } from "@buttery/components";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";

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

const Delete02Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={16}
    height={16}
    color="currentColor"
    fill={"none"}
    {...props}
  >
    <title>delete</title>
    <path
      d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9.5 16.5L9.5 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14.5 16.5L14.5 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Settings05Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={16}
    height={16}
    color="currentColor"
    fill={"none"}
    {...props}
  >
    <title>config</title>
    <path
      d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M15.5 17C16.3284 17 17 16.3284 17 15.5C17 14.6716 16.3284 14 15.5 14C14.6716 14 14 14.6716 14 15.5C14 16.3284 14.6716 17 15.5 17Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10 8.5L17 8.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 15.5L7 15.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

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
              <Settings05Icon />
            </button>
            <button
              className={classes(buttonStyles, "delete")}
              onClick={dxOnRemove}
            >
              <Delete02Icon />
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
