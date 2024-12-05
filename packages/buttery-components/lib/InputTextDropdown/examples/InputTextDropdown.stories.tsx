import type { Meta } from "@storybook/react";

import InputTextDropdownBasicExample from "./InputTextDropdownBasic.example.js";
import InputTextDropdownWithFormExample from "./InputTextDropdownWithForm.example.js";

const meta: Meta = {
  title: "Forms / InputTextDropdown",
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = InputTextDropdownBasicExample;
export const WithForm = InputTextDropdownWithFormExample;
