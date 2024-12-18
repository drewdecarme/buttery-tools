import type { Meta } from "@storybook/react";
import { useModal } from "@buttery/components";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { ModalHeader } from "./ModalHeader";

const meta: Meta = {
  title: "Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export function SizeSm() {
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
      <Modal ref={modalRef} dxSize="sm">
        <ModalHeader>Modal - SM</ModalHeader>
      </Modal>
    </>
  );
}

export function SizeMd() {
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
      <Modal ref={modalRef} dxSize="md">
        <ModalHeader dxSubtitle="Are your sure you want to delete this?">
          Modal - MD
        </ModalHeader>
      </Modal>
    </>
  );
}

export function SizeLg() {
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
      <Modal ref={modalRef} dxSize="lg">
        <ModalHeader dxSubtitle="Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna.">
          Modal - LG
        </ModalHeader>
      </Modal>
    </>
  );
}

export function SizeXl() {
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
      <Modal ref={modalRef} dxSize="xl">
        <ModalHeader dxSubtitle="Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna.">
          Modal - XL
        </ModalHeader>
      </Modal>
    </>
  );
}

export function SizeFull() {
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
      <Modal ref={modalRef} dxSize="full">
        <ModalHeader dxSubtitle="This modal is one step shy of a 'total' dialog which would take up the full screen. It's sized at a 100% of the height and width of the screen to ensure that it still appears as a dialog but also has adequate room to do complex things.">
          Modal - Full
        </ModalHeader>
      </Modal>
    </>
  );
}
