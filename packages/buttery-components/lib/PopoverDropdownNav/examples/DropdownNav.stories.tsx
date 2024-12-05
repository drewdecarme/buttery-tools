import type { Meta } from "@storybook/react";

import DropdownNavExample from "./DropdownNav.example";
import DropdownNavBarebonesExample from "./DropdownNavBarebones.example";
import DropdownNavNestedNavExample from "./DropdownNavNestedNav.example";
import DropdownNavRecursionExample from "./DropdownNavRecursion.example";

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
