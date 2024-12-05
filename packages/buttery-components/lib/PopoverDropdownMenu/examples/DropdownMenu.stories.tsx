import type { Meta } from "@storybook/react";

import DropdownMenuExample from "./DropdownMenu.example.js";
import DropdownMenuBarebonesExample from "./DropdownMenuBarebones.example.js";
import DropdownMenuGroupsExample from "./DropdownMenuGroups.example.js";
import DropdownMenuPositionsExample from "./DropdownMenuPositions.example.js";
import DropdownMenuWithArrowExample from "./DropdownMenuWithArrow.example.js";
import DropdownMenuWithOffsetExample from "./DropdownMenuWithOffset.example.js";

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
