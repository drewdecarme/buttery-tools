import type { Meta } from "@storybook/react";
import { default as ExampleUsePortal } from "./examples/UsePortal.example";

const meta: Meta = {
  title: "Hooks / usePortal",
} satisfies Meta<typeof meta>;

export default meta;

export const Base = ExampleUsePortal;
