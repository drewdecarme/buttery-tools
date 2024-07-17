import type { Meta } from "@storybook/react";
import { Drawer } from "./Drawer";
import { useDrawer } from "./drawer.useDrawer";

const meta: Meta = {
  title: "Modals / Drawer",
} satisfies Meta<typeof meta>;

export default meta;

export const RightToLeft = () => {
  const { drawerRef, openDrawer } = useDrawer();

  return (
    <>
      <button type="button" onClick={openDrawer}>
        Toggle Drawer
      </button>
      <Drawer ref={drawerRef} dxOrientation="right-to-left">
        This is some drawer content!
      </Drawer>
    </>
  );
};

export const LeftToRight = () => {
  const { drawerRef, openDrawer } = useDrawer();

  return (
    <>
      <button type="button" onClick={openDrawer}>
        Toggle Drawer
      </button>
      <Drawer ref={drawerRef} dxOrientation="left-to-right">
        This is some drawer content!
      </Drawer>
    </>
  );
};
