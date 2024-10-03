import { header } from "virtual:data";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import { LayoutHeader } from "./components/LayoutHeader";

export default function AppLayout() {
  console.log("here");
  return (
    <Layout>
      <LayoutHeader header={header} />
      <AppRoutes />
    </Layout>
  );
}
