import type { FC } from "react";
import { Fragment } from "react/jsx-runtime";
import type { ButteryDocsGraph } from "../../lib/types";

/**
 * Recursive component designed to create a sidebar tree form
 * nested pages.
 */
const SectionGroup: FC<{ graph: ButteryDocsGraph }> = ({ graph }) => {
  return (
    <ul>
      {Object.entries(graph).map(([graphKey, graphValue]) => {
        return (
          <li key={graphKey}>
            {graphValue.title}
            {Object.entries(graphValue.pages).length > 0
              ? SectionGroup({ graph: graphValue.pages })
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
    <nav>
      {Object.entries(graph).map(([sectionKey, sectionValues]) => {
        if (sectionKey === "index") return null;
        return (
          <section key={sectionKey}>
            <h1>{sectionValues.title}</h1>
            <SectionGroup graph={sectionValues.pages} />
          </section>
        );
      })}
    </nav>
  );
}
