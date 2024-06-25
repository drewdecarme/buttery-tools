/**
 * ## Description
 * A utility that returns the rem value of the pixel number provided. This utility is intended to reduce the mental load of translating pixel units (that are commonly provided in design assets) into rem units which are necessary for creating interfaces that scale with browser defaults & zoom levels.
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeRem } from "@buttery/tokens/test-tokens";
 *
 * const aClassName = css`
 *   font-size: ${makeRem(12)};
 * `
 * ```
 * 
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makeRem } from "@buttery/tokens/test-tokens";;
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontSize: makeRem(12) }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export const makeRem = (pixel: number) => `${pixel / 16}rem`;
