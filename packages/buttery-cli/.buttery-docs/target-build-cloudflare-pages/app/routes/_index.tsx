import { NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import { type FC, memo } from "react";

import { getButteryDocsConfig } from "../../../../../.buttery/commands/_utils/util.getButteryDocsConfig";
import { getButteryDocsGraph } from "../../../../../.buttery/commands/_utils/util.getButteryDocsGraph";
import { Layout } from "../../../../components";

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
  const butteryDocsGraph = await getButteryDocsGraph(butteryDocsConfig);

  return json({
    graph: butteryDocsGraph,
    header: butteryDocsConfig.docs.header ?? null,
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
