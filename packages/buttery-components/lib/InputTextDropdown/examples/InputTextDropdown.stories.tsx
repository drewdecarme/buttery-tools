import type { Meta } from "@storybook/react";

import InputTextDropdownBasicExample from "./InputTextDropdownBasic.example";
import InputTextDropdownWithFormExample from "./InputTextDropdownWithForm.example";

const meta: Meta = {
  title: "Forms / InputTextDropdown",
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = InputTextDropdownBasicExample;
export const WithForm = InputTextDropdownWithFormExample;
