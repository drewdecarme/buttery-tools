import type { Meta } from "@storybook/react";
import ModalBaseExample from "./ModalBase.example";
import ModalBasicExample from "./ModalBasic.example";
import ModalWithNestedFormsExample from "./ModalWithNestedForms.example";

const meta: Meta = {
  title: "Modals / Modal",
} satisfies Meta<typeof meta>;

export default meta;

export const Base = ModalBaseExample;
export const Basic = ModalBasicExample;
export const WithNestedForms = ModalWithNestedFormsExample;
