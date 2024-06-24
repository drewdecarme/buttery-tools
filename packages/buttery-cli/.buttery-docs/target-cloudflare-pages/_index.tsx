import { NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import React from "react";
import { type FC, memo } from "react";
import { getButteryDocsFiles } from "../../.buttery/cmds/docs/shared.getButteryDocFiles";
import { getButteryDocsConfig } from "../../.buttery/cmds/docs/shared.getButteryDocsConfig";
import { getButteryDocsGraph } from "../../.buttery/cmds/docs/shared.getButteryDocsGraph";
import { orderButteryDocFiles } from "../../.buttery/cmds/docs/shared.orderButteryDocFiles";
import { Layout } from "../components";

const RemixNavLink: FC<JSX.IntrinsicElements["a"] & { href: string }> = memo(
  function RemixNavLink({ children, href, ...restProps }) {
    return (
      <NavLink to={href} {...restProps} end>
        {children}
      </NavLink>
    );
  }
);

export async function loader() {
  const butteryDocsConfig = await getButteryDocsConfig();
  const files = await getButteryDocsFiles(butteryDocsConfig);
  const orderedFiles = orderButteryDocFiles(butteryDocsConfig, files);
  const butteryDocsGraph = await getButteryDocsGraph(
    butteryDocsConfig,
    orderedFiles
  );

  return json({
    graph: butteryDocsGraph,
    header: butteryDocsConfig.docs.header ?? null,
  });
}

export default function IndexRoute() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <Layout
      header={loaderData.header}
      graph={loaderData.graph}
      NavLinkComponent={RemixNavLink}
    >
      <Outlet />
    </Layout>
  );
}
