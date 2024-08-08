import type { Meta } from "@storybook/react";

import ToastExample from "./examples/Toast.example";
import ToastBestPracticeExample from "./examples/ToastBestPractice.example";
import ToastMultipleToastersExample from "./examples/ToastMultipleToasters.example";

const meta: Meta = {
  title: "Popovers / Toast",
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = ToastExample;
export const BestPractice = ToastBestPracticeExample;
export const BestMultipleToasters = ToastMultipleToastersExample;
