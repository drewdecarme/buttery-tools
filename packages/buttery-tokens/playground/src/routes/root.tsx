import { NavLink, Outlet } from "react-router-dom";
import { Icon } from "../components/icon/Icon";
import { Layout as LayoutComponent } from "../components/layout/Layout";
import { LayoutFooter } from "../components/layout/LayoutFooter";
import { LayoutHeader } from "../components/layout/LayoutHeader";
import { LayoutMain } from "../components/layout/LayoutMain";
import { LayoutNav } from "../components/layout/LayoutNav";

export default function Root() {
  return (
    <LayoutComponent>
      <LayoutNav
        btLogoSrc="/images/buttery-tokens-logo.png"
        btLogoAlt="buttery-tokens-logo"
      >
        <li>
          <NavLink to="/color">
            <Icon icon="palette" />
            <div>color</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/font">
            <Icon icon="text-font-stroke-rounded" />
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
      <LayoutFooter>footer</LayoutFooter>
    </LayoutComponent>
  );
}
