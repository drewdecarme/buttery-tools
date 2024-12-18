import type { Meta, StoryObj } from "@storybook/react";

import { ButtonDropdown, type ButtonDropdownProps } from "./ButtonDropdown";

const meta: Meta = {
  title: "ButtonDropdown",
  component: ButtonDropdown,
};

export default meta;
type Story = StoryObj<typeof meta>;

const dxOptions: ButtonDropdownProps["dxOptions"] = [
  {
    dxLabel: "option 1",
    dxAction: (e) => alert(`clicked ${e.currentTarget.innerText}`),
  },
];

export const ContainedDense: Story = {
  args: {
    dxVariant: "contained",
    dxSize: "dense",
    children: "Button",
    dxOptions,
  } as ButtonDropdownProps,
};

export const ContainedNormal: Story = {
  args: {
    dxVariant: "contained",
    dxSize: "normal",
    children: "Button",
    dxOptions,
  } as ButtonDropdownProps,
};

export const OutlinedDense: Story = {
  args: {
    dxVariant: "outlined",
    dxSize: "dense",
    children: "Button",
    dxOptions,
  } as ButtonDropdownProps,
};

export const OutlinedNormal: Story = {
  args: {
    dxVariant: "outlined",
    dxSize: "normal",
    children: "Button",
    dxOptions,
  } as ButtonDropdownProps,
};

export const TextDense: Story = {
  args: {
    dxVariant: "text",
    dxSize: "dense",
    children: "Button",
    dxOptions,
  } as ButtonDropdownProps,
};

export const TextNormal: Story = {
  args: {
    dxVariant: "text",
    dxSize: "normal",
    children: "Button",
    dxOptions,
  } as ButtonDropdownProps,
};
