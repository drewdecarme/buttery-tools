import type { Meta } from "@storybook/react";

import { NavTabs } from "./NavTabs";
import { NavTab } from "./NavTab";
import { NavTabContent } from "./NavTabContent";
import { NavTabLabel } from "./NavTabLabel";

const meta: Meta = {
  title: "NavTabs",
  component: NavTabs,
};

export default meta;

export const Stateful = () => {
  return (
    <NavTabs dxInitActiveTab="diff">
      <ul>
        <li>
          <NavTab id="diff">
            <NavTabLabel>Tab 1</NavTabLabel>
            <NavTabContent>Tab 1 content</NavTabContent>
          </NavTab>
        </li>
        <li>
          <NavTab id="version-history">
            <NavTabLabel>Tab 2</NavTabLabel>
            <NavTabContent>Tab 2 content</NavTabContent>
          </NavTab>
        </li>
      </ul>
    </NavTabs>
  );
};
