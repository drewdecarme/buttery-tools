import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeRem,
} from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC, ReactNode } from "react";

const SLayoutBodyMain = styled("section")`
  grid-area: layout-main;
  background: ${makeColorStatic("background")};
  position: sticky;
  top: ${makeCustom("layout-header-height")};

  & > div {
    padding: ${makeRem(32)} ${makeRem(48)};
    max-width: ${makeRem(668)};

    h1,
    h2,
    h3 {
      background: ${makeColorStatic("background")};
    }
    h1,
    h2 {
      padding: 0.83em 0;
      margin: 0;
    }

    h2,
    h3 {
      position: sticky;
      top: ${makeCustom("layout-header-height")};
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

    p {
      margin: 0;
      font-size: ${makeRem(16)};
      line-height: ${makeRem(24)};
      z-index: 9;
      background: ${makeColorStatic("background")};
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
