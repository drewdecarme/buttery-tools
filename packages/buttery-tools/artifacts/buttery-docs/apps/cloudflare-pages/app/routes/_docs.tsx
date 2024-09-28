import {
  LayoutBody,
  LayoutBodyMain,
  LayoutBodyNav,
  LayoutBodyTOC,
  getGraphValueThatMatchesPathname,
} from "@buttery/tools/docs";
import type { HeadersFunction, MetaFunction } from "@remix-run/cloudflare";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import { graph } from "~/buttery/docs/data";

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
  // @ts-ignore graph and Jsonify graph are the same but typed differently
  const graphValue = getGraphValueThatMatchesPathname(pathname, data.graph);
  return graphValue.routeMeta;
};

export default function DocsLayout() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <LayoutBody>
      <LayoutBodyNav
        // @ts-ignore mismatch
        graph={loaderData?.graph ?? {}}
      />
      <LayoutBodyMain>
        <Outlet />
      </LayoutBodyMain>
      <LayoutBodyTOC
        // @ts-ignore mismatch
        graph={loaderData?.graph ?? {}}
      />
    </LayoutBody>
  );
}
