export type FontWeight = "bold" | "semi-bold" | "medium" | "regular" | "light";
export type MakeFontWeight = (fontWeightName: FontWeight) => string;

/**
 * ## Description
 * A utility that returns the CSS variable assigned to keys of the `font.family` that are defined in the `buttery.config.ts`
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeFontWeight } from "@buttery/tokens/test-tokens";
 *
 * const aClassName = css`
 *   font-weight: ${makeFontWeight("bold")};
 * `
 * ```
 * 
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makeFontWeight } from "@buttery/tokens/test-tokens";
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontWeight: makeFontWeight("bold") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export const makeFontWeight: MakeFontWeight = (value) => {
    return `var(--buttery-tokens-font-weight-${value})`
};
