import type { Meta } from "@storybook/react";
import { useModal } from "@buttery/components";

import { ModalDrawer } from "./ModalDrawer";
import { Button } from "./Button";
import { ModalHeader } from "./ModalHeader";

const meta: Meta = {
  title: "ModalDrawer",
  component: ModalDrawer,
};

export default meta;

export function RightToLeft() {
  const { openModal, modalRef } = useModal();
  return (
    <>
      <Button
        dxSize="normal"
        dxColor="secondary"
        dxVariant="contained"
        onClick={openModal}
      >
        Open Modal
      </Button>
      <ModalDrawer ref={modalRef} dxVariant="right-to-left">
        <ModalHeader>Right to left drawer</ModalHeader>
      </ModalDrawer>
    </>
  );
}
