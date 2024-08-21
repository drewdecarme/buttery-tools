import { Outlet } from "react-router-dom";
import { LayoutBody } from "../../../components";

export default function DocsRoute() {
  return (
    <LayoutBody>
      <Outlet />
    </LayoutBody>
  );
}
