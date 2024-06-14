import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeRem,
  makeReset,
} from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC, ReactNode } from "react";

const SLayoutBodyMain = styled("section")`
  grid-area: layout-main;
  background: ${makeColorStatic("background")};
  position: sticky;
  top: ${makeCustom("layout-header-height")};

  & > div {
    padding: 0 ${makeRem(32)} ${makeRem(48)} ${makeRem(32)};
    max-width: ${makeRem(668)};

    h1,
    h2,
    h3 {
      background: ${makeColorStatic("background")};
      margin: 0;
    }
    h1,
    h2 {
      padding: 0.83em 0;
    }

    h1 {
      font-size: ${makeRem(40)};
    }

    h2 {
      border-bottom: ${makeRem(1)} solid
        ${makeColor("neutral", { variant: "50" })};

      & + p {
        margin: ${makeRem(16)} 0;
      }
    }

    h3 {
      padding: 1em 0;
    }

    a {
      ${makeReset("anchor")};
    }

    p {
      font-size: ${makeRem(16)};
      line-height: ${makeRem(24)};
      z-index: 9;
      background: ${makeColorStatic("background")};

      a {
        background-color: ${makeColor("secondary", {
          variant: "50",
          opacity: 0.2,
        })};
        color: ${makeColor("secondary", { variant: "700" })} !important;
        padding: 0 ${makeRem(4)};
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const LayoutBodyMain: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SLayoutBodyMain>
      <div>{children}</div>
    </SLayoutBodyMain>
  );
};
