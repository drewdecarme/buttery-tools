export type Breakpoints = "phone-small" | "phone" | "phone-large" | "tablet-small" | "tablet" | "tablet-large" | "desktop-small" | "desktop" | "desktop-large";
export type MakeResponsive = (params: { from?: Breakpoints, to?: Breakpoints }) => string;

/**
 * ## Description
 * A utility that enables you to easily create a `@media`
string that can be interpolated in CSS-in-JS syntax.
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeResponsive } from "@buttery/tokens/test-tokens";
 *
 * const aClassName = css`
 *   ${makeResponsive({ from: "phone-small" })} {
 *     display: none;
 *   }
 * `
 * ```
 */
export const makeResponsive: MakeResponsive = (params) => {
    const from = params?.from ? `var(--buttery-tokens-breakpoint-${params.from})` : undefined;
    const to = params?.to ? `calc(var(--buttery-tokens-breakpoint-${params.to}) - 1px)` : undefined;
    if (from && to) {
      return `@media (min-width: ${from}) and @media (max-width:${to})`;
    }
    if (from && !to) {
      return `@media (min-width: ${from})`;
    }
    if (to && !from) {
      return `@media (max-width: ${to})`;
    }
    throw new Error("You must provide a to or from parameter.")
};
