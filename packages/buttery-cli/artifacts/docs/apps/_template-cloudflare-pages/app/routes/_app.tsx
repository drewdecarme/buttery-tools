import { Outlet } from "@remix-run/react";
import { LayoutBody } from "../../../../components";

export function AppLayout() {
  return (
    <>
      hello
      <LayoutBody>
        <Outlet />
      </LayoutBody>
    </>
  );
}
