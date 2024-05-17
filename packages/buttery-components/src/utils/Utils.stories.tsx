import type { Meta } from "@storybook/react";
import { ResponsiveMobile } from "./ResponsiveMobile";
import { ResponsiveTablet } from "./ResponsiveTablet";
import { ResponsiveDesktop } from "./ResponsiveDesktop";
const meta: Meta = {
  title: "Utils / Responsive",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;

const Content = () => {
  return (
    <div
      style={{
        marginTop: "1rem",
        width: "100%",
        padding: "2rem",
        border: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      hello 😄
    </div>
  );
};

export const Variants = () => {
  return (
    <>
      <div>
        The below should only display when the viewport is below{" "}
        <strong>tablet</strong>
      </div>
      <ResponsiveMobile>
        <Content />
      </ResponsiveMobile>
      <br />
      <br />
      <div>
        The below should only display when the viewport is between{" "}
        <strong>tablet</strong> &amp; <strong>desktop</strong>
      </div>
      <ResponsiveTablet>
        <Content />
      </ResponsiveTablet>
      <br />
      <br />
      <div>
        The below should only display when the viewport is above{" "}
        <strong>desktop</strong>
      </div>
      <ResponsiveDesktop>
        <Content />
      </ResponsiveDesktop>
    </>
  );
};
