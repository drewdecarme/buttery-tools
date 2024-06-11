import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import { type FC, memo } from "react";

import { getButteryDocsConfig } from "../../../../../commands/_utils/util.getButteryDocsConfig";
import { getButteryDocsGraph } from "../../../../../commands/_utils/util.getButteryDocsGraph";
import { Layout } from "../../../../components";
import { getGraphValueThatMatchesURLPathname } from "../../../../library";

const RemixNavLink: FC<JSX.IntrinsicElements["a"] & { href: string }> = memo(
  function RemixNavLink({ children, href, ...restProps }) {
    return (
      <NavLink to={href} {...restProps} end>
        {children}
      </NavLink>
    );
  }
);

export async function loader(args: LoaderFunctionArgs) {
  const butteryDocsConfig = await getButteryDocsConfig();
  const butteryDocsGraph = await getButteryDocsGraph(butteryDocsConfig);
  const { toc: tableOfContents } = getGraphValueThatMatchesURLPathname(
    args.request.url,
    butteryDocsGraph
  );

  return json({
    graph: butteryDocsGraph,
    header: butteryDocsConfig.docs.header ?? null,
    tableOfContents,
  });
}

export default function IndexRoute() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <Layout {...loaderData} NavLinkComponent={RemixNavLink}>
      <Outlet />
    </Layout>
  );
}
