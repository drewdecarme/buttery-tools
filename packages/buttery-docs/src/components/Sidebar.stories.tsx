import type { Meta, StoryObj } from "@storybook/react";

import { Sidebar, type SidebarProps } from "./Sidebar";
import { graph } from "./Sidebar.stories.data";

const meta: Meta = {
  title: "Sidebar",
  // @ts-expect-error Props mismatch
  component: Sidebar
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    graph: graph
  } as SidebarProps
};
