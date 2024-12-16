import type { Meta, StoryObj } from "@storybook/react";

import {
  InputSelectDropdown,
  type InputSelectDropdownProps,
} from "./InputSelectDropdown";

const meta: Meta = {
  title: "InputSelectDropdown",
  component: InputSelectDropdown,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: <div style={{ height: "400px", backgroundColor: "green" }}></div>,
  } as InputSelectDropdownProps,
};
