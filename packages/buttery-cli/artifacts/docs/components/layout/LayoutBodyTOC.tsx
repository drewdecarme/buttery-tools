import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";

import { css } from "@linaria/core";
import { useLocation } from "@remix-run/react";
import clsx from "clsx";
import { type FC, type MouseEventHandler, useCallback } from "react";
import type { ButteryDocsGraphTOC } from "../../../../.buttery/commands/docs/docs.types";
import { getGraphValueThatMatchesPathname } from "../../library";
import { useDetermineActiveSection } from "./layout.useDetermineActiveSection";
import { useLayoutContext } from "./layout.useLayoutContext";
import { layoutNavOverlineCSS } from "./layout.utils";

const layoutBodyStyles = css`
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

const ulStyles = css`
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

const overlineStyles = css`
  margin-bottom: ${makeRem(16)};
`;

export function ContentsNode({
  tableOfContents,
}: {
  tableOfContents: ButteryDocsGraphTOC[];
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
          <ContentsNode tableOfContents={toc.children} />
        </ul>
      )}
    </li>
  ));
}
export const LayoutBodyTOC: FC = () => {
  const { graph } = useLayoutContext();
  const { pathname } = useLocation();
  const currentGraph = getGraphValueThatMatchesPathname(pathname, graph);
  useDetermineActiveSection(pathname);

  return (
    <article className={layoutBodyStyles}>
      <div>
        <div className={clsx(layoutNavOverlineCSS, overlineStyles)}>
          on this page
        </div>
        <ul className={ulStyles}>
          <ContentsNode tableOfContents={currentGraph.toc} />
        </ul>
      </div>
    </article>
  );
};
