import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";

export const styleGuideTableStyles = css`
  position: relative;
  border: 0;
  padding: 0;
  border-spacing: 0;
  width: 100%;
  isolation: isolate;
  border-collapse: collapse;

  th,
  td {
    margin: 0;
    border: 0;
    padding: 0;
    padding: 0 ${makeRem(8)};
  }

  th {
    height: ${makeRem(56)};
    font-weight: 700;
    font-family: "Playfair Display";
    font-size: ${makeRem(14)};
    text-transform: uppercase;
    white-space: nowrap;

    &:last-child {
      padding: 0 ${makeRem(16)};
    }
  }
`;
