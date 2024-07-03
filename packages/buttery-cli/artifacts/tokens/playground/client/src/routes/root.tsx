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
            <div>
              <IconComponent icon="palette" />
            </div>
            <div>Palette</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/font">
            <div>
              <IconComponent icon="text-font-stroke-rounded" />
            </div>
            <div>Typography</div>
          </NavLink>
        </li>
      </LayoutNav>
      <LayoutHeader>
        <a
          href="https://github.com/drewdecarme/buttery-tools/tree/main/packages/buttery-tokens"
          target="_blank"
          rel="noreferrer"
        >
          <IconComponent icon="github-circle-solid-rounded" />
        </a>
      </LayoutHeader>
      <LayoutMain>
        <Outlet />
      </LayoutMain>
      <ScrollRestoration />
    </Layout>
  );
}
