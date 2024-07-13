import type { ButteryConfigTokens } from "@buttery/core";
import { IconComponent } from "@buttery/icons";
import {
  NavLink,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { LayoutMain } from "../components/layout/LayoutMain";
import { LayoutMainContent } from "../components/layout/LayoutMainContent";
import { LayoutMainTools } from "../components/layout/LayoutMainTools";
import { LayoutNav } from "../components/layout/LayoutNav";
import { LayoutPane } from "../components/layout/LayoutPane";
import { Toaster } from "../components/toast";
import { ActionBar } from "../features/action-bar";
import { ConfigProvider } from "../features/config/Config.context";
import { Output } from "../features/output";

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
          <LayoutMainTools>
            <ActionBar />
          </LayoutMainTools>
          <LayoutMainContent>
            <Output />
          </LayoutMainContent>
        </LayoutMain>
      </ConfigProvider>
      <ScrollRestoration />
      <Toaster />
    </Layout>
  );
}
