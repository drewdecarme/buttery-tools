import type { Meta, StoryObj } from "@storybook/react";

import { Button, type ButtonProps } from "./Button";

const meta: Meta = {
  title: "Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainedDense: Story = {
  args: {
    dxVariant: "contained",
    dxSize: "dense",
    children: "Button",
  } as ButtonProps,
};

export const ContainedNormal: Story = {
  args: {
    dxVariant: "contained",
    dxSize: "normal",
    children: "Button",
  },
};

export const OutlinedDense: Story = {
  args: {
    dxVariant: "outlined",
    dxSize: "dense",
    children: "Button",
  },
};

export const OutlinedNormal: Story = {
  args: {
    dxVariant: "outlined",
    dxSize: "normal",
    children: "Button",
  },
};

export const TextDense: Story = {
  args: {
    dxVariant: "text",
    dxSize: "dense",
    children: "Button",
  },
};

export const TextNormal: Story = {
  args: {
    dxVariant: "text",
    dxSize: "normal",
    children: "Button",
  },
};