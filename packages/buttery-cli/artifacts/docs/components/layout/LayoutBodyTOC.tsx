import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";
import { styled } from "@linaria/react";
import { useLocation } from "@remix-run/react";
import { type FC, type MouseEventHandler, useCallback } from "react";
import type { ButteryDocsGraphTOC } from "../../../../.buttery/commands/docs/shared.types";
import { getGraphValueThatMatchesPathname } from "../../library";
import { useDetermineActiveSection } from "./layout.useDetermineActiveSection";
import { useLayoutContext } from "./layout.useLayoutContext";
import { layoutNavOverlineCSS } from "./layout.utils";

const SLayoutBodyTOC = styled("article")`
  grid-area: layout-toc;
  background: ${makeColorStatic("background")};

  & > div {
    padding: ${makeRem(32)};
    position: sticky;
    top: ${makeCustom("layout-header-height")};

    &:before {
      content: "";
      display: block;
      left: 0;
      position: absolute;
      top: ${makeRem(32)};
      bottom: ${makeRem(32)};
      width: ${makeRem(1)};
      border-left: ${makeRem(1)} solid
        ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
    }
  }
`;

const SUl = styled("ul")`
  ${makeReset("ul")};

  & ul {
    padding-left: ${makeRem(16)};
  }

  li {
    a {
      ${makeReset("anchor")};
      display: flex;
      align-items: center;
      height: ${makeRem(32)};
      color: ${makeColor("neutral")};
      transition: all 0.15s ease-in-out;
      font-size: ${makeRem(14)};

      &:not(.active) {
        &:hover {
          color: ${makeColor("secondary")};
          text-decoration: underline;
        }
      }

      &.active {
        color: ${makeColor("secondary")};
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
  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>((e) => {
    e.preventDefault();
    const anchorHash = e.currentTarget.hash;
    window.history.replaceState(null, "", anchorHash);
    // get the heading with the ID of hash
    const headingWithIdOfAnchorHash =
      document.querySelector<HTMLHeadingElement>(anchorHash);
    const header = document.querySelector<HTMLElement>("header");
    if (!headingWithIdOfAnchorHash || !header) return;
    const offset =
      headingWithIdOfAnchorHash.offsetTop - header.offsetHeight + 64;

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }, []);

  return tableOfContents.map((toc, i) => (
    <li key={toc.link}>
      <a href={toc.link} onClick={handleClick} className="contents-link">
        {toc.title}
      </a>
      {toc.children.length > 0 && (
        <ul key={`group-${toc.level}-${i}`}>
          <ContentsNode
            tableOfContents={toc.children}
            NavLinkComponent={NavLinkComponent}
          />
        </ul>
      )}
    </li>
  ));
}

export const LayoutBodyTOC: FC = () => {
  const { NavLinkComponent, graph } = useLayoutContext();
  const { pathname } = useLocation();
  const currentGraph = getGraphValueThatMatchesPathname(pathname, graph);
  useDetermineActiveSection(pathname);

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
