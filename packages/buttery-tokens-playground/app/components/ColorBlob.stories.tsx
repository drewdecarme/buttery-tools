import type { Meta, StoryObj } from "@storybook/react";

import { ColorBlob, type ColorBlobProps } from "./ColorBlob";

const meta: Meta<typeof ColorBlob> = {
  title: "ColorBlob",
  component: ColorBlob,
  decorators: [
    (Story) => (
      <div style={{ height: 44 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CircleHue: Story = {
  args: {
    dxVariant: "circle",
    dxType: "hue",
    dxValue: 40,
  } as ColorBlobProps,
};

export const CircleHex: Story = {
  args: {
    dxVariant: "circle",
    dxType: "hex",
    dxValue: "248ced",
  } as ColorBlobProps,
};

export const SquareHue: Story = {
  args: {
    dxVariant: "square",
    dxType: "hue",
    dxValue: 40,
  } as ColorBlobProps,
};

export const SquareHex: Story = {
  args: {
    dxVariant: "square",
    dxType: "hex",
    dxValue: "248ced",
  } as ColorBlobProps,
};
