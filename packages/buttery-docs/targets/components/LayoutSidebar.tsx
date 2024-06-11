import {
  makeColor,
  makeCustom,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/_docs";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
// import { NativeAnchor } from "./native";
import { NavLink } from "@remix-run/react";
import { type FC, useMemo } from "react";
import type { ButteryDocsGraph } from "../../commands/_utils/types";
import { useLayoutContext } from "./Layout.context";

const SSidebar = styled("nav")`
  grid-area: layout-sidebar;
  padding: ${makeRem(32)};
  border-right: ${makeRem(1)} solid
    ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
`;

const SSidebarContent = styled("div")`
  position: sticky;
  top: ${makeCustom("layout-header-height")};
  h1 {
    margin: 0;
  }
`;

const SUl = styled("ul")`
  list-style-type: none;
  padding-left: 0;
  margin-left: 0;
  position: relative;

  & & {
    li {
      margin-left: ${makeRem(16)};
      &:before {
        content: "";
        position: absolute;
        left: ${makeRem(8)};
        top: 0;
        bottom: 0;
        width: ${makeRem(1)};
        background: ${makeColor("neutral", { variant: "50" })};
      }
    }
  }

  li {
    padding: 0;
  }
`;

const SSection = styled("section")`
  margin-bottom: ${makeRem(24)};
  & + & {
    padding-top: ${makeRem(24)};
    border-top: ${makeRem(1)} solid
      ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
  }
`;

const SSectionOverline = styled("h1")`
  font-size: ${makeRem(12)};
  text-transform: uppercase;
  font-weight: ${makeFontWeight("semi-bold")};
  color: ${makeColor("neutral", { variant: "300" })};
  letter-spacing: ${makeRem(1.4)};
`;

const anchorCss = css`
  height: ${makeRem(32)};
  text-decoration: none;
  color: ${makeColor("neutral")};
  padding: 0 ${makeRem(8)};
  border-radius: ${makeRem(4)};
  font-size: ${makeRem(14)};
  display: flex;
  align-items: center;
  margin-bottom: ${makeRem(8)};
  transition: all 0.15s ease-in-out;

  &:visited {
    color: inherit;
  }

  &.active {
    background: ${makeColor("primary", { variant: "300", opacity: 0.2 })};
    color: ${makeColor("primary")};
    font-weight: ${makeFontWeight("semi-bold")};
  }
  &:not(.active) {
    &:hover {
      background: ${makeColor("primary", { variant: "200", opacity: 0.2 })};
      color: ${makeColor("primary")};
      font-weight: ${makeFontWeight("semi-bold")};
    }
  }
`;

/**
 * Recursive component designed to create a sidebar tree form
 * nested pages.
 */
export type SidebarItemProps = {
  graph: ButteryDocsGraph;
  NavLinkComponent: JSX.ElementType | undefined;
};
const SidebarItem: FC<SidebarItemProps> = ({ graph, NavLinkComponent }) => {
  // const NavLink = NavLinkComponent ?? NativeAnchor;
  return (
    <SUl>
      {Object.entries(graph).map(([graphKey, graphValue]) => {
        return (
          <li key={graphKey}>
            <NavLink to={graphValue.routeAbs} className={anchorCss} end>
              {graphValue.title}
            </NavLink>
            {Object.entries(graphValue.pages).length > 0
              ? SidebarItem({ graph: graphValue.pages, NavLinkComponent })
              : null}
          </li>
        );
      })}
    </SUl>
  );
};

export const LayoutSidebar: FC = () => {
  const { graph, NavLinkComponent } = useLayoutContext();
  return useMemo(
    () => (
      <SSidebar>
        <SSidebarContent>
          {Object.entries(graph).map(([sectionKey, sectionValues]) => {
            if (sectionKey === "_index") return null;
            return (
              <SSection key={sectionKey}>
                <SSectionOverline>{sectionValues.title}</SSectionOverline>
                <SidebarItem
                  graph={sectionValues.pages}
                  NavLinkComponent={NavLinkComponent}
                />
              </SSection>
            );
          })}
        </SSidebarContent>
      </SSidebar>
    ),
    [graph, NavLinkComponent]
  );
};
