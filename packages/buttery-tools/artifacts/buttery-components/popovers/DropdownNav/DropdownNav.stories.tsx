import type { Meta } from "@storybook/react";
import DropdownNavExample from "./examples/DropdownNav.example";
import DropdownNavBarebonesExample from "./examples/DropdownNavBarebones.example";
import DropdownNavNestedNavExample from "./examples/DropdownNavNestedNav.example";
import DropdownNavRecursionExample from "./examples/DropdownNavRecursion.example";

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
