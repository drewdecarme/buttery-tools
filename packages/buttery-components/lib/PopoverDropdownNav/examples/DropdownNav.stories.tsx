import type { Meta } from "@storybook/react";

import DropdownNavExample from "./DropdownNav.example.js";
import DropdownNavBarebonesExample from "./DropdownNavBarebones.example.js";
import DropdownNavNestedNavExample from "./DropdownNavNestedNav.example.js";
import DropdownNavRecursionExample from "./DropdownNavRecursion.example.js";

const meta: Meta = {
  title: "Popovers / Dropdown Nav",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = DropdownNavExample;
export const Barebones = DropdownNavBarebonesExample;
export const Nested = DropdownNavNestedNavExample;
export const Recursion = DropdownNavRecursionExample;
