import type { Meta } from "@storybook/react";
import UseTooltipExample from "./UseTooltip.example";

const meta: Meta = {
  title: "Hooks / useTooltip",
} satisfies Meta<typeof meta>;

export default meta;

export const Basic = UseTooltipExample;
