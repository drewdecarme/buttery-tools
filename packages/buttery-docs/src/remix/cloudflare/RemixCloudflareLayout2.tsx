import type { ReactNode } from "react";
import { Sidebar } from "../../components";
import type { ButteryDocsGraph } from "../../types";

export function Layout(props: {
  graph: ButteryDocsGraph;
  children: ReactNode;
}) {
  return (
    <div>
      <header>header</header>
      <main>
        <Sidebar graph={props.graph} />
        {props.children}
      </main>
      <footer>footer</footer>
    </div>
  );
}
