import type { Meta } from "@storybook/react";
import DropdownNavExample from "./examples/DropdownNav.example";

const meta: Meta = {
  title: "Popovers / Dropdown Nav",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = DropdownNavExample;
