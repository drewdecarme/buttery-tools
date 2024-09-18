import type { Meta } from "@storybook/react";
import DropdownMenuExample from "./examples/DropdownMenu.example";
import DropdownMenuBarebonesExample from "./examples/DropdownMenuBarebones.example";
import DropdownMenuGroupsExample from "./examples/DropdownMenuGroups.example";
import DropdownMenuPositionsExample from "./examples/DropdownMenuPositions.example";
import DropdownMenuWithArrowExample from "./examples/DropdownMenuWithArrow.example";
import DropdownMenuWithOffsetExample from "./examples/DropdownMenuWithOffset.example";

const meta: Meta = {
  title: "Popovers / Dropdown Menu",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = DropdownMenuExample;
export const Barebones = DropdownMenuBarebonesExample;
export const WithOffset = DropdownMenuWithOffsetExample;
export const WithArrow = DropdownMenuWithArrowExample;
export const Positions = DropdownMenuPositionsExample;
export const Groups = DropdownMenuGroupsExample;
