export type FontFamily = "heading" | "body";
export type MakeFontFamily = (fontFamilyName: FontFamily) => string;

/**
 * ## Description
 * A utility that returns the CSS variable assigned to keys of the `font.family` that are defined in the `buttery.config.ts`
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeFontFamily } from "@buttery/tokens/test-tokens";
 *
 * const aClassName = css`
 *   font-family: ${makeFontFamily("heading")};
 * `
 * ```
 * 
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makeFontFamily } from "@buttery/tokens/test-tokens";
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontFamily: makeFontFamily("body") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export const makeFontFamily: MakeFontFamily = (value) => {
    return `var(--buttery-tokens-font-family-${value})`
};
