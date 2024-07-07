import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";
import { useMenu } from "./menu.useMenu";

const meta: Meta = {
  title: "Popovers / Menu",
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic = () => {
  const { openMenu, menuRef, targetRef } = useMenu<HTMLButtonElement>();

  return (
    <>
      <button type="button" onClick={openMenu} ref={targetRef}>
        open menu
      </button>
      <Menu ref={menuRef} targetRef={targetRef}>
        <div>I'm some content</div>
      </Menu>
    </>
  );
};
