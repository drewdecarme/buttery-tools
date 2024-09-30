import { Modal } from "../Modal";
import { useModal } from "../modal.useModal";

export default function ModalUsage() {
  const { modalRef, openModal } = useModal();

  return (
    <>
      <button type="button" onClick={openModal}>
        Open a bare bones example
      </button>
      <Modal ref={modalRef}>
        This is the simplest implementation of a modal
      </Modal>
    </>
  );
}
