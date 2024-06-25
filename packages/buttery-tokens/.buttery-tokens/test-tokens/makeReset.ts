export type MakeReset = (element: "ul" | "button" | "body" | "anchor") => string;

const matchGuard = (_: never): never => {
  throw new Error(`Forgot to include an ${_} in the switch statement`);
};

/**
 * ## Description
 * Returns some CSS resets for any given elements
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeReset } from "@buttery/tokens/test-tokens";
 *
 * const aClassName = css`
 *   ul {
 *     ${makeReset("ul")};
 * 
 *     li {
 *       height: 24px;
 *       width: 24px;
 *     }
 *   }
 * `
 * ```
 */
export const makeReset: MakeReset = (element) => {
    switch(element) {
      case "ul":
        return `
          margin: 0;
          padding: 0;

          li {
            margin: 0;
            padding: 0;
            list-style-type: none;
          }
        `;

      case "button":
        return `
          margin: 0;
          padding: 0;
          border: none;
          background: none;
        `;

      case "body":
        return `
          margin: 0;
          padding: 0;
        `;

      case "anchor":
        return `
          text-decoration: none;
          color: inherit;

          &:visited {
            color: inherit;
          }
        `;

      default:
        return matchGuard(element);
    }
};
