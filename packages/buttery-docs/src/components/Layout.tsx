import { makeRem } from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC, ReactNode } from "react";
import type { ButteryDocsGraph } from "../types";

const SContainer = styled("div")`
  display: grid;
  min-height: 100vh;
  // desktop
  grid-template-rows: ${makeRem(40)};
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
`;

const SSidebar = styled("nav")`
  background: red;
  grid-area: sidebar;
`;

const SHeader = styled("header")`
  grid-area: header;
`;
const SMain = styled("main")`
  grid-area: main;
`;
const SFooter = styled("footer")`
  grid-area: footer;
`;

/**
 * Recursive component designed to create a sidebar tree form
 * nested pages.
 */
export type SidebarItemProps = { graph: ButteryDocsGraph };
const SidebarItem: FC<SidebarItemProps> = ({ graph }) => {
  return (
    <ul>
      {Object.entries(graph).map(([graphKey, graphValue]) => {
        return (
          <li key={graphKey}>
            {graphValue.title}
            {Object.entries(graphValue.pages).length > 0
              ? SidebarItem({ graph: graphValue.pages })
              : null}
          </li>
        );
      })}
    </ul>
  );
};

export type LayoutProps = { graph: ButteryDocsGraph; children: ReactNode };
export function Layout({ graph, children }: LayoutProps) {
  return (
    <SContainer>
      <SHeader>header</SHeader>
      <SSidebar>
        {Object.entries(graph).map(([sectionKey, sectionValues]) => {
          if (sectionKey === "_index") return null;
          return (
            <section key={sectionKey}>
              <h1>{sectionKey}</h1>
              <SidebarItem graph={sectionValues.pages} />
            </section>
          );
        })}
      </SSidebar>
      <SMain>{children}</SMain>
      <SFooter>footer</SFooter>
    </SContainer>
  );
}
