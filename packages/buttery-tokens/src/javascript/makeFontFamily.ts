import { type MakeFontFamily, prefix } from "./javascript.utils";

/**
 * ## Description
 * A utility that returns the CSS variable assigned
 * to keys of the `font.family` that are defined
 * in the `buttery.config.ts`
 *
 * ## Usage
 * ```ts
 * import { css } from "@linaria/core";
 *
 * const aClassName = css`
 *   font-family: ${makeFontFamily("keyof font.family")}
 * `
 * ```
 */
export const makeFontFamily: MakeFontFamily = (value) => {
  return `var(--${prefix}-font-family-${value})`;
};
