import { classes } from "@buttery/components";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ReactNode } from "react";
import { forwardRef } from "react";

export type LayoutConfigSectionControlsPropsNative =
  JSX.IntrinsicElements["article"];
export type LayoutConfigSectionControlsPropsCustom = {
  dxTitle: string;
  dxDescription: ReactNode;
};
export type LayoutConfigSectionControlsProps =
  LayoutConfigSectionControlsPropsNative &
    LayoutConfigSectionControlsPropsCustom;

const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={16}
    height={16}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.992 8H12.001"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const styles = css`
  padding-right: ${makeRem(32)};
  border-right: ${makeRem(1)} solid
    ${makeColor("neutral-light", { opacity: 0.2 })};

  & > .title {
    display: flex;
    align-items: center;
    gap: ${makeRem(8)};
    margin-bottom: ${makeRem(24)};

    button {
      ${makeReset("button")};
      height: ${makeRem(24)};
      aspect-ratio: 1 / 1;
      display: grid;
      place-content: center;
    }
  }

  h3 {
    margin: 0;
    font-size: ${makeRem(16)};
    font-weight: ${makeFontWeight("bold")};
  }
`;

export const LayoutConfigSectionControls = forwardRef<
  HTMLElement,
  LayoutConfigSectionControlsProps
>(function LayoutConfigSectionControls(
  { children, className, dxTitle, ...restProps },
  ref
) {
  return (
    <article {...restProps} className={classes(styles, className)} ref={ref}>
      <div className="title">
        <h3>{dxTitle}</h3>
        <button>
          <InformationCircleIcon />
        </button>
      </div>
      {children}
    </article>
  );
});
