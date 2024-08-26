import { Outlet } from "@remix-run/react";
import { LayoutBody } from "../../../../components/layout/LayoutBody";

export default function DocsLayout() {
  return (
    <LayoutBody>
      <Outlet />
    </LayoutBody>
  );
}
