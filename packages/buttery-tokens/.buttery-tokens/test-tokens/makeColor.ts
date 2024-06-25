export type Color = "primary" | "secondary" | "warning" | "danger" | "neutral";
export type ColorVariant = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700";
export type MakeColor = (color: Color, options?: { variant?: ColorVariant; opacity?: number }) => string;

/**
 * ## Description
 * A utility that allows you to incorporate color
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeColor } from "@buttery/tokens/test-tokens";
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ color: makeColor("primary") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * 
 * `
 * ```
 */
export const makeColor: MakeColor = (hue, options) => {
  console.log(hue, options);
  const opacity = options?.opacity ?? 1;
  const variant = options?.variant ? `-${options.variant}` : "";
  return `hsla(var(--buttery-tokens-color-${hue}${variant}-h), var(--buttery-tokens-color-${hue}${variant}-s), var(--buttery-tokens-color-${hue}${variant}-l), ${opacity})`;
};
