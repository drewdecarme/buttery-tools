import { NavLink, Outlet } from "@remix-run/react";

export const handle = {
  breadcrumb: () => (
    <NavLink to="/clients" end>
      Clients
    </NavLink>
  ),
};

export default function DashboardClientsPage() {
  return <Outlet />;
}
