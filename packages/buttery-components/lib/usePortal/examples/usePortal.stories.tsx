import type { Meta } from "@storybook/react";

import ExampleUsePortal from "./UsePortal.example";
import ExampleUsePortalPositioning from "./UsePortalPositioning.example";

const meta: Meta = {
  title: "Hooks / usePortal",
} satisfies Meta<typeof meta>;

export default meta;

export const Base = ExampleUsePortal;
export const Positioning = ExampleUsePortalPositioning;
