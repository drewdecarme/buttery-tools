import type { Meta, StoryObj } from "@storybook/react";

import { Layout, type LayoutProps } from "./Layout";
import { graph } from "./Layout.stories.data";

const meta: Meta = {
  title: "Layout",
  // @ts-expect-error Props mismatch
  component: Layout,
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    graph: graph,
    children: <div style={{ height: 10_000 }}>body</div>,
  } as LayoutProps,
};

export const WithLogo: Story = {
  args: {
    graph: graph,
    header: {
      logo: {
        src: "/images/buttery-tokens-logo.png",
        alt: "buttery-tokens",
      },
    },
    children: <div style={{ height: 10_000 }}>body</div>,
  } as LayoutProps,
};

export const WithTitle: Story = {
  args: {
    graph: graph,
    header: {
      title: "Buttery Tokens | Documentation",
    },
    children: <div style={{ height: 10_000 }}>body</div>,
  } as LayoutProps,
};

export const WithLogoAndTitle: Story = {
  args: {
    graph: graph,
    header: {
      title: "Buttery Tokens | Documentation",
      logo: {
        src: "/images/buttery-tokens-logo.png",
        alt: "buttery-tokens",
      },
    },
    children: <div style={{ height: 10_000 }}>body</div>,
  } as LayoutProps,
};
