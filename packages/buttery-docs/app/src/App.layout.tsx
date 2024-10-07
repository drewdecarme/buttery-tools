import { header } from "virtual:data";
import { Outlet } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LayoutHeader } from "./components/LayoutHeader";

export default function AppLayout() {
  return (
    <Layout>
      <LayoutHeader header={header} />
      <Outlet />
    </Layout>
  );
}
