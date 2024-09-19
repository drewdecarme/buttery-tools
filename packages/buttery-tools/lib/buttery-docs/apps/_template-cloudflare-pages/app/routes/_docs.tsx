import { Outlet, json, useLoaderData } from "@remix-run/react";
import { LayoutBody } from "../../../../components/layout/LayoutBody";
import { LayoutBodyMain } from "../../../../components/layout/LayoutBodyMain";
import { LayoutBodyNav } from "../../../../components/layout/LayoutBodyNav";
import { LayoutBodyTOC } from "../../../../components/layout/LayoutBodyTOC";

import type { HeadersFunction, MetaFunction } from "@remix-run/cloudflare";
import { getGraphValueThatMatchesPathname } from "../../../../utils";
import { graph } from "../data";

export async function loader() {
  return json({
    graph: graph ?? null,
  });
}

export const headers: HeadersFunction = () => ({ "Cache-Control": "no-cache" });

export const meta: MetaFunction<typeof loader> = ({
  location: { pathname },
  data,
}) => {
  if (!data?.graph) return [];
  // @ts-expect-error graph and Jsonify graph are the same but typed differently
  const graphValue = getGraphValueThatMatchesPathname(pathname, data.graph);
  return graphValue.routeMeta;
};

export default function DocsLayout() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <LayoutBody>
      <LayoutBodyNav
        // @ts-expect-error mismatch
        graph={loaderData?.graph ?? {}}
      />
      <LayoutBodyMain>
        <Outlet />
      </LayoutBodyMain>
      <LayoutBodyTOC
        // @ts-expect-error mismatch
        graph={loaderData?.graph ?? {}}
      />
    </LayoutBody>
  );
}
