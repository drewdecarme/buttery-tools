import { forwardRef } from "react";
import { css } from "@linaria/core";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { classes } from "@buttery/components";

export type ColorSwatchAddPropsNative = JSX.IntrinsicElements["button"];
export type ColorSwatchAddProps = ColorSwatchAddPropsNative;

const buttonStyles = css`
  ${makeReset("button")};
  display: flex;
  color: ${makeColor("secondary-800")};
  font-weight: ${makeFontWeight("semi-bold")};
  font-size: ${makeRem(12)};
  gap: ${makeRem(4)};
  align-items: center;

  &:hover {
    color: ${makeColor("secondary-900")};
  }
`;
const Add01Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={12}
    height={12}
    color="currentColor"
    fill={"none"}
    {...props}
  >
    <title>add</title>
    <path
      d="M12 4V20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 12H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ColorSwatchAdd = forwardRef<
  HTMLButtonElement,
  ColorSwatchAddProps
>(function ColorSwatchAdd({ children, className, ...restProps }, ref) {
  return (
    <button
      className={classes(buttonStyles, className)}
      ref={ref}
      {...restProps}
    >
      <Add01Icon />
      <span>Add a color</span>
    </button>
  );
});
