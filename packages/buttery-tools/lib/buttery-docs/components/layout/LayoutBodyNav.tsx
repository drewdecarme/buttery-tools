import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { NavLink } from "@remix-run/react";
import type { FC } from "react";
import { LayoutBodyNavItem } from "./LayoutBodyNavItem";
import { LayoutTextOverline } from "./LayoutTextOverline";

import type { ButteryDocsGraph } from ".buttery/commands/docs/docs.types";

const navStyles = css`
  grid-area: layout-sidebar;
  align-self: start;
  border-right: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  max-height: ${`calc(100% - ${makeCustom("layout-header-height")})`};
  overflow-y: auto;
  position: sticky;
  top: ${makeCustom("layout-header-height")};
  align-self: start;
`;

const navContentStyles = css`
  position: sticky;
  padding: ${makeRem(32)};
  top: ${makeCustom("layout-header-height")};
  h1 {
    margin: 0;
  }
`;

const sectionStyles = css`
  margin-bottom: ${makeRem(16)};
  & + & {
    padding-top: ${makeRem(16)};
    border-top: ${makeRem(1)} solid
      ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  }
`;

const anchorOverlineCSS = css`
  ${makeReset("anchor")};
  transition: all 0.15s ease-in-out;
  transition: all 0.25s;

  &.active,
  &:hover {
    & > * {
      font-weight: ${makeFontWeight("bold")};
      color: ${makeColor("primary")};
    }
  }

  & + ul {
    max-height: 1000px;
    transition: all 0.5s ease-in-out;
    overflow: hidden;
    margin-right: initial;
  }

  &:not(.active) {
    & + ul {
      max-height: 0;
      margin: 0;
    }
  }
`;

export type LayoutBodyNavProps = { graph: ButteryDocsGraph | null };

export const LayoutBodyNav: FC<LayoutBodyNavProps> = ({ graph }) => {
  return (
    <nav className={navStyles}>
      <div className={navContentStyles}>
        {Object.entries(graph ?? {}).map(([sectionKey, sectionValues]) => {
          if (sectionKey === "_index") return null;
          return (
            <section key={sectionKey} className={sectionStyles}>
              <NavLink
                to={sectionValues.routeAbs}
                className={anchorOverlineCSS}
              >
                <LayoutTextOverline>
                  {sectionValues.routeTitle}
                </LayoutTextOverline>
              </NavLink>
              <LayoutBodyNavItem graph={sectionValues.pages} />
            </section>
          );
        })}
      </div>
    </nav>
  );
};
