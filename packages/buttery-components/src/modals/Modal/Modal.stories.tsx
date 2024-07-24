import type { Meta, StoryObj } from "@storybook/react";
import { default as ExampleModalBase } from "./examples/ModalBase.example";
import { default as ExampleModalBasic } from "./examples/ModalBasic.example";

const meta: Meta = {
  title: "Modals / Modal",
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base = ExampleModalBase;
export const Basic = ExampleModalBasic;
