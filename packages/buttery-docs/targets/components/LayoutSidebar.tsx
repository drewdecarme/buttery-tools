import { makeColor, makeFontWeight, makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC } from "react";
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
  top: ${makeRem(40)};
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

const SAnchor = styled("a")`
  height: ${makeRem(28)};
  text-decoration: none;
  color: ${makeColor("neutral")};
  padding: 0 ${makeRem(8)};
  border-radius: ${makeRem(8)};
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
export type SidebarItemProps = { graph: ButteryDocsGraph };
const SidebarItem: FC<SidebarItemProps> = ({ graph }) => {
  return (
    <SUl>
      {Object.entries(graph).map(([graphKey, graphValue]) => {
        return (
          <li key={graphKey}>
            <SAnchor href={graphValue.routeAbs}>{graphValue.title}</SAnchor>
            {Object.entries(graphValue.pages).length > 0
              ? SidebarItem({ graph: graphValue.pages })
              : null}
          </li>
        );
      })}
    </SUl>
  );
};

export const LayoutSidebar: FC = () => {
  const { graph } = useLayoutContext();
  return (
    <SSidebar>
      <SSidebarContent>
        {Object.entries(graph).map(([sectionKey, sectionValues]) => {
          if (sectionKey === "_index") return null;
          return (
            <SSection key={sectionKey}>
              <SSectionOverline>{sectionValues.title}</SSectionOverline>
              <SidebarItem graph={sectionValues.pages} />
            </SSection>
          );
        })}
      </SSidebarContent>
    </SSidebar>
  );
};
