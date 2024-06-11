import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import { useLocation } from "@remix-run/react";
import type { FC } from "react";
import type { ButteryDocsGraphTOC } from "../../commands/_utils/types";
import { getGraphValueThatMatchesPathname } from "../library";
import { useLayoutContext } from "./Layout.context";
import { layoutNavOverlineCSS } from "./layout.utils";

const SLayoutBodyTOC = styled("article")`
  grid-area: layout-toc;
  border-left: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  background: ${makeColorStatic("background")};

  & > div {
    padding: ${makeRem(32)};
    position: sticky;
    top: ${makeCustom("layout-header-height")};
  }
`;

const SUl = styled("ul")`
  ${makeReset("ul")};

  & ul {
    padding-left: ${makeRem(8)};
  }

  li {
    a {
      ${makeReset("anchor")};
      display: flex;
      align-items: center;
      height: ${makeRem(32)};
      color: ${makeColor("neutral")};
      transition: all 0.15s ease-in-out;

      &:not(.active) {
        &:hover {
          color: ${makeColor("primary")};
          font-weight: ${makeFontWeight("semi-bold")};
        }
      }

      &.active {
        color: ${makeColor("primary")};
        font-weight: ${makeFontWeight("semi-bold")};
      }
    }
  }
`;

const SOverline = styled("div")`
  margin-bottom: ${makeRem(16)};
`;

export function ContentsNode({
  tableOfContents,
  NavLinkComponent,
}: {
  tableOfContents: ButteryDocsGraphTOC[];
  NavLinkComponent: JSX.ElementType;
}) {
  return tableOfContents.map((toc, i) => {
    return (
      <li key={`${toc.level}-${i}`}>
        <a href={toc.link}>{toc.title}</a>
        {toc.children.length > 0 && (
          <ul key={`group-${toc.level}-${i}`}>
            <ContentsNode
              tableOfContents={toc.children}
              NavLinkComponent={NavLinkComponent}
            />
          </ul>
        )}
      </li>
    );
  });
}

export const LayoutBodyTOC: FC = () => {
  const { NavLinkComponent, graph } = useLayoutContext();
  const { pathname } = useLocation();
  const currentGraph = getGraphValueThatMatchesPathname(pathname, graph);

  return (
    <SLayoutBodyTOC>
      <div>
        <SOverline className={layoutNavOverlineCSS}>on this page</SOverline>
        <SUl>
          <ContentsNode
            tableOfContents={currentGraph.toc}
            NavLinkComponent={NavLinkComponent}
          />
        </SUl>
      </div>
    </SLayoutBodyTOC>
  );
};
