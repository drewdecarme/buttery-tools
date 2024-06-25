export type ColorStatic = "background" | "surface";
export type MakeColorStatic = (color: ColorStatic, options?: { opacity?: number }) => string;

/**
 * ## Description
 * A utility that allows you to utilize static colors that are defined outside of the boundaries of the harmonious color presets
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeColorStatic } from "@buttery/tokens/test-tokens";
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ color: makeColorStatic("background") }}
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
export const makeColorStatic: MakeColorStatic = (color, options) => {
  const opacity = options?.opacity ?? 1;
  return `hsla(var(--buttery-tokens-color-static-${color}-h), var(--buttery-tokens-color-static-${color}-s), var(--buttery-tokens-color-static-${color}-l), ${opacity})`;
};
