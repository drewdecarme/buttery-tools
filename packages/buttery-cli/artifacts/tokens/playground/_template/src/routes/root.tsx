import { IconComponent } from "@buttery/icons";
import { NavLink, Outlet, ScrollRestoration } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { LayoutHeader } from "../components/layout/LayoutHeader";
import { LayoutMain } from "../components/layout/LayoutMain";
import { LayoutNav } from "../components/layout/LayoutNav";

export default function Root() {
  return (
    <Layout>
      <LayoutNav>
        <li>
          <NavLink to="/color">
            <IconComponent icon="palette" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/font">
            <IconComponent icon="text-font-stroke-rounded" />
          </NavLink>
        </li>
      </LayoutNav>
      <LayoutHeader
        btLogoSrc="/images/buttery-tokens-logo.png"
        btLogoAlt="buttery-tokens-logo"
      >
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
