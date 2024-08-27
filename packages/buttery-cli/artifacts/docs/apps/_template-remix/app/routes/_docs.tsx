import { Outlet, json, useLoaderData } from "@remix-run/react";
import { LayoutBody } from "../../../../components/layout/LayoutBody";
import { LayoutBodyMain } from "../../../../components/layout/LayoutBodyMain";
import { LayoutBodyNav } from "../../../../components/layout/LayoutBodyNav";
import { LayoutBodyTOC } from "../../../../components/layout/LayoutBodyTOC";

import { graph } from "../data";

export async function loader() {
  return json({
    graph: graph ?? null
  });
}

export default function DocsLayout() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <LayoutBody>
      <LayoutBodyNav graph={loaderData?.graph ?? {}} />
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
