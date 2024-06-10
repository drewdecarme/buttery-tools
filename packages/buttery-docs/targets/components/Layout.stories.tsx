import type { Meta, StoryObj } from "@storybook/react";

import { Layout, type LayoutProps } from "./Layout";
import { graph } from "./Layout.stories.data";

const meta: Meta = {
  title: "Layout",
  // @ts-expect-error Props mismatch
  component: Layout
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    graph: graph,
    children: <div style={{ height: 10_000 }}>body</div>
  } as LayoutProps
};
