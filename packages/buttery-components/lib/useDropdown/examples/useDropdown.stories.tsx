import type { Meta } from "@storybook/react";

import UseDropdownOriginExample from "./UseDropdownOrigin.example.js";
import UseDropdownExample from "./UseDropdown.example.js";

const meta: Meta = {
  title: "Hooks / useDropdown",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;

export const Base = UseDropdownExample;
export const Origin = UseDropdownOriginExample;
