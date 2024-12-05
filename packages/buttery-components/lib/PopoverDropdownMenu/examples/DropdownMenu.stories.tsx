import type { Meta } from "@storybook/react";

import DropdownMenuExample from "./DropdownMenu.example";
import DropdownMenuBarebonesExample from "./DropdownMenuBarebones.example";
import DropdownMenuGroupsExample from "./DropdownMenuGroups.example";
import DropdownMenuPositionsExample from "./DropdownMenuPositions.example";
import DropdownMenuWithArrowExample from "./DropdownMenuWithArrow.example";
import DropdownMenuWithOffsetExample from "./DropdownMenuWithOffset.example";

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
