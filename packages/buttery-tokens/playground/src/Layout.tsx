import type { ReactNode } from "react";

import { Icon } from "./components/icon/Icon";
import { Layout as LayoutComponent } from "./components/layout/Layout";
import { LayoutFooter } from "./components/layout/LayoutFooter";
import { LayoutHeader } from "./components/layout/LayoutHeader";
import { LayoutMain } from "./components/layout/LayoutMain";
import { LayoutNav } from "./components/layout/LayoutNav";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <LayoutComponent>
      <LayoutNav
        btLogoSrc="/images/buttery-tokens-logo.png"
        btLogoAlt="buttery-tokens-logo"
      >
        <li>
          <a>
            <Icon icon="text-font-stroke-rounded" />
            <div>font</div>
          </a>
        </li>
        <li>
          <a className="active">
            <Icon icon="palette" />
            <div>color</div>
          </a>
        </li>
      </LayoutNav>
      <LayoutHeader>
        <h1 className="title">buttery tokens</h1>
      </LayoutHeader>
      <LayoutMain>{children}</LayoutMain>
      <LayoutFooter>footer</LayoutFooter>
    </LayoutComponent>
  );
}
