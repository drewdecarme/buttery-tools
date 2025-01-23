import { useModal } from "@buttery/components";

import { Modal } from "~/components/Modal";
import { ModalBody } from "~/components/ModalBody";
import { ModalHeader } from "~/components/ModalHeader";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";
import { ButtonDropdown } from "~/components/ButtonDropdown";
import { Button } from "~/components/Button";
import { ModalFooter } from "~/components/ModalFooter";
import { IconInspectCode } from "~/icons/IconInspectCode";
import { DropdownMenu } from "~/components/DropdownMenu";
import { DropdownMenuItem } from "~/components/DropdownMenuItem";
import { IconTimeManagement } from "~/icons/IconTimeManagement";

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
        DXIconStart={IconFloppyDisk}
        onClick={saveConfig}
        dxLabel="Save"
      >
        <DropdownMenu>
          <li>
            <DropdownMenuItem
              dxTitle="Inspect Changes"
              dxSubtitle="Review a side-by-side comparison of changes"
              DXIcon={IconInspectCode}
              dxTheme="primary"
              onClick={openModal}
            />
          </li>
          <li>
            <DropdownMenuItem
              dxTitle="Version History"
              dxSubtitle="Compare, review, or revert to earlier versions."
              DXIcon={IconTimeManagement}
              dxTheme="secondary"
              onClick={openModal}
            />
          </li>
        </DropdownMenu>
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
