import { NavLink, Outlet } from "@remix-run/react";

import { ConfigurationProvider } from "~/components/Config.context";
import { NavTabs } from "~/components/NavTabs";

export default function AppConfigRoute() {
  return (
    <ConfigurationProvider>
      <h2>Configure</h2>
      <NavTabs>
        <ul>
          <li>
            <NavLink to="." end>
              Color
            </NavLink>
          </li>
          <li>
            <NavLink to="./grid-system">Grid System</NavLink>
          </li>
          <li>
            <NavLink to="./typography">Typography</NavLink>
          </li>
          <li>
            <NavLink to="./response">Response</NavLink>
          </li>
          <li>
            <NavLink to="./custom">Custom</NavLink>
          </li>
        </ul>
      </NavTabs>
      <div>
        <Outlet />
      </div>
    </ConfigurationProvider>
  );
}
