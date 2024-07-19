import type { Meta, StoryObj } from "@storybook/react";
import { Modal, type ModalProps } from "./Modal";
import styles from "./modal.styles";
import { useModal } from "./modal.useModal";

function ModalStory(props: Omit<ModalProps, "children">) {
  const { modalRef, openModal } = useModal();

  return (
    <>
      <button type="button" onClick={openModal}>
        Toggle Modal
      </button>
      <Modal ref={modalRef} {...props} className={styles}>
        This is some drawer content!
      </Modal>
    </>
  );
}

const meta: Meta = {
  title: "Modals / Modal",
  component: ModalStory,
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    dxSize: "sm",
  } as ModalProps,
};
