import { styled } from "@linaria/react";
import type { FC } from "react";
import type { ButteryDocsGraph } from "../types";

const SNav = styled("nav")`
  background: red;
`;

/**
 * Recursive component designed to create a sidebar tree form
 * nested pages.
 */
export type SidebarGroupProps = { graph: ButteryDocsGraph };
const SidebarGroup: FC<SidebarGroupProps> = ({ graph }) => {
  return (
    <ul>
      {Object.entries(graph).map(([graphKey, graphValue]) => {
        return (
          <li key={graphKey}>
            {graphValue.title}
            {Object.entries(graphValue.pages).length > 0
              ? SidebarGroup({ graph: graphValue.pages })
              : null}
          </li>
        );
      })}
    </ul>
  );
};

export type SidebarProps = { graph: ButteryDocsGraph };
export function Sidebar({ graph }: SidebarProps) {
  return (
    <SNav>
      {Object.entries(graph).map(([sectionKey, sectionValues]) => {
        if (sectionValues.routePath === "/") return null;
        return (
          <section key={sectionKey}>
            <h1>{sectionKey}</h1>
            <SidebarGroup graph={sectionValues.pages} />
          </section>
        );
      })}
    </SNav>
  );
}
