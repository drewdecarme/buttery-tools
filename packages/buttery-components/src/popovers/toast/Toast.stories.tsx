import type { Meta } from "@storybook/react";

import ToastExample from "./examples/Toast.example";

const meta: Meta = {
  title: "Popovers / Toast",
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = ToastExample;
