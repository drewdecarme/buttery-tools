import type { ButteryConfigTokens } from "@buttery/core";
import { IconComponent } from "@buttery/icons";
import { useState } from "react";
import {
  NavLink,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { LayoutMain } from "../components/layout/LayoutMain";
import { LayoutMainContent } from "../components/layout/LayoutMainContent";
import { LayoutMainContentActions } from "../components/layout/LayoutMainContentActions";
import { LayoutNav } from "../components/layout/LayoutNav";
import { LayoutPane } from "../components/layout/LayoutPane";
import { ActionBar } from "../features/action-bar";
import { ConfigProvider } from "../features/config/Config.context";

export default function Root() {
  const config = useLoaderData() as ButteryConfigTokens;

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
          </NavLink>
        </li>
        <li>
          <NavLink to="/font">
            <div>
              <IconComponent icon="text-font-stroke-rounded" />
            </div>
          </NavLink>
        </li>
      </LayoutNav>
      <ConfigProvider initConfig={config}>
        <LayoutPane>
          <Outlet />
        </LayoutPane>
        <LayoutMain>
          <LayoutMainContent>
            <LayoutMainContentActions>
              <ActionBar />
            </LayoutMainContentActions>
          </LayoutMainContent>
        </LayoutMain>
      </ConfigProvider>
      <ScrollRestoration />
    </Layout>
  );
}
