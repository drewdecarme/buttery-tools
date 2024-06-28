import { IconComponent } from "@buttery/icons";
import { NavLink, Outlet, ScrollRestoration } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { LayoutHeader } from "../components/layout/LayoutHeader";
import { LayoutMain } from "../components/layout/LayoutMain";
import { LayoutNav } from "../components/layout/LayoutNav";

export default function Root() {
  return (
    <Layout>
      <LayoutNav
        btLogoSrc="/images/buttery-tokens-logo.png"
        btLogoAlt="buttery-tokens-logo"
      >
        <li>
          <NavLink to="/color">
            <IconComponent icon="palette" />
            <div>color</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/font">
            <IconComponent icon="text-font-stroke-rounded" />
            <div>font</div>
          </NavLink>
        </li>
      </LayoutNav>
      <LayoutHeader>
        <h1 className="title">buttery tokens</h1>
      </LayoutHeader>
      <LayoutMain>
        <Outlet />
      </LayoutMain>
      <ScrollRestoration />
    </Layout>
  );
}
