import { useModal } from "@buttery/components";

import { Modal } from "~/components/Modal";
import { ModalBody } from "~/components/ModalBody";
import { ModalHeader } from "~/components/ModalHeader";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";
import { ButtonDropdown } from "~/components/ButtonDropdown";
import { Button } from "~/components/Button";
import { ModalFooter } from "~/components/ModalFooter";

import { ConfigSaveDiff } from "./ConfigSaveDiff";
import { useSaveConfig } from "./config.useSave";

export function ConfigSave() {
  const { openModal, modalRef, closeModal } = useModal();
  const { saveConfig } = useSaveConfig();

  function saveAndClose() {
    saveConfig();
    closeModal();
  }

  return (
    <>
      <ButtonDropdown
        dxVariant="contained"
        DXAdornmentStart={<IconFloppyDisk dxSize={16} />}
        onClick={saveConfig}
        dxOptions={[{ dxLabel: "Compare and Save", dxAction: openModal }]}
      >
        Save
      </ButtonDropdown>
      <Modal ref={modalRef} dxSize="full" dxVariant="contain">
        <ModalHeader dxSubtitle="View your modified config next to the original & make any changes necessary. Once complete, click the 'save' button at the bottom right hand of the screen.">
          View Diff & Save
        </ModalHeader>
        <ModalBody>
          <ConfigSaveDiff />
        </ModalBody>
        <ModalFooter>
          <Button
            dxColor="primary"
            dxSize="big"
            dxVariant="outlined"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            dxColor="primary"
            dxSize="big"
            dxVariant="contained"
            onClick={saveAndClose}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
