import type { Meta } from "@storybook/react";
import { default as ExampleUseDynamicNode } from "./examples/UseDynamicNode.example";

const meta: Meta = {
  title: "Hooks / useDynamicNode",
} satisfies Meta<typeof meta>;

export default meta;

export const Base = ExampleUseDynamicNode;
