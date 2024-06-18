import type { ButteryConfigDocs } from "@buttery/core";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import type { ButteryDocsGraph } from "../../../.buttery/commands/_utils/types";
import { Layout, bodyCSS } from "../../../targets/components";

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
