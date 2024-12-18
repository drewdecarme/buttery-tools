import { useModal } from "@buttery/components";
import { css } from "@linaria/core";
import { DiffEditor } from "@monaco-editor/react";

import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";
import { ModalBody } from "~/components/ModalBody";
import { ModalHeader } from "~/components/ModalHeader";
import { NavTab } from "~/components/NavTab";
import { NavTabContent } from "~/components/NavTabContent";
import { NavTabLabel } from "~/components/NavTabLabel";
import { NavTabs } from "~/components/NavTabs";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";

import { ConfigSaveDiff } from "./ConfigSaveDiff";

const styles = css`
  * {
    font-family: unset;
  }
`;

function Differ() {
  return (
    <div className={styles}>
      <NavTabs dxInitActiveTab="diff">
        <ul>
          <li>
            <NavTab id="diff">
              <NavTabLabel>Diff Editor</NavTabLabel>
              <NavTabContent>
                <ConfigSaveDiff />
              </NavTabContent>
            </NavTab>
          </li>
          <li>
            <NavTab id="version-history">
              <NavTabLabel>Version History</NavTabLabel>
              <NavTabContent>test</NavTabContent>
            </NavTab>
          </li>
        </ul>
      </NavTabs>
    </div>
  );
}

export function ConfigSave() {
  const { openModal, modalRef } = useModal();
  return (
    <>
      <Button
        dxVariant="outlined"
        DXAdornmentStart={<IconFloppyDisk dxSize={16} />}
        onClick={openModal}
      >
        Save
      </Button>
      <Modal ref={modalRef} dxSize="full">
        <ModalHeader dxSubtitle="Save you work by accepting the difference between your changes and the previous version of your configuration file.">
          Compare and Save
        </ModalHeader>
        <ModalBody>
          <Differ />
        </ModalBody>
      </Modal>
    </>
  );
}
