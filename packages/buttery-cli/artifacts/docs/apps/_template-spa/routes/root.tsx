import type { ButteryConfigDocs } from "@buttery/core";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { Layout, bodyCSS } from "../../../components";
import type { ButteryDocsGraph } from ".buttery/commands/docs/shared.types";

export default function RootRoute() {
  const loaderData = useLoaderData() as {
    graph: ButteryDocsGraph;
    header: ButteryConfigDocs["header"];
  };

  return (
    <div className={bodyCSS}>
      <Layout
        graph={loaderData.graph}
        header={loaderData.header}
        NavLinkComponent={NavLink}
      >
        <Outlet />
      </Layout>
      <ScrollRestoration />
    </div>
  );
}
