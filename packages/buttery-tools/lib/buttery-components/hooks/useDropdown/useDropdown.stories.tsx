import type { Meta } from "@storybook/react";
import { default as ExampleUseDropdown } from "./examples/UseDropdown.example";

const meta: Meta = {
  title: "Hooks / useDropdown",
} satisfies Meta<typeof meta>;

export default meta;

export const Base = ExampleUseDropdown;
