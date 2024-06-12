import { makeColor, makeFontWeight, makeRem } from "@buttery/tokens/_docs";
import { css } from "@linaria/core";

export const layoutNavOverlineCSS = css`
  font-size: ${makeRem(12)};
  text-transform: uppercase;
  font-weight: ${makeFontWeight("semi-bold")};
  color: ${makeColor("neutral", { variant: "300" })};
  letter-spacing: ${makeRem(1.4)};
`;
