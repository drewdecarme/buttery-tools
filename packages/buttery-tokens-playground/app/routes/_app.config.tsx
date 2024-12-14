import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { NavLink, Outlet } from "@remix-run/react";

import { ConfigurationProvider } from "~/components/Config.context";
import { NavTabs } from "~/components/NavTabs";

const styles = css`
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;

  h2 {
    padding: ${makeRem(20)} 0;
    margin: 0;
  }
`;

export default function AppConfigRoute() {
  return (
    <ConfigurationProvider>
      <div className={styles}>
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
      </div>
      <div>
        <Outlet />
      </div>
    </ConfigurationProvider>
  );
}
