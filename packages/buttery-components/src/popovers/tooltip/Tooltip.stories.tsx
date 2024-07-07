import { IconComponent } from "@buttery/icons";
import type { Meta } from "@storybook/react";

import { Tooltip } from "./Tooltip";

const meta: Meta = {
  title: "Popovers / Tooltips",
  // @ts-expect-error Props mismatch
  component: Tooltip,
} satisfies Meta<typeof meta>;

export default meta;

export const Label = () => {
  return (
    <Tooltip dxType="label" dxId="save" dxLabel="save">
      <button
        type="button"
        style={{ padding: 0, border: 0, background: "none" }}
      >
        <div
          style={{
            height: 24,
            width: 24,
            display: "gird",
            placeContent: "center",
          }}
        >
          <IconComponent icon="floppy-disk" />
        </div>
      </button>
    </Tooltip>
  );
};
