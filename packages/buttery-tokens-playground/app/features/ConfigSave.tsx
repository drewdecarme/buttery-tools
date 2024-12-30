import { useModal } from "@buttery/components";
import { css } from "@linaria/core";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";

import { Modal } from "~/components/Modal";
import { ModalBody } from "~/components/ModalBody";
import { ModalHeader } from "~/components/ModalHeader";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";
import { ButtonDropdown } from "~/components/ButtonDropdown";
import { Button } from "~/components/Button";
import { ModalFooter } from "~/components/ModalFooter";
import { IconInspectCode } from "~/icons/IconInspectCode";

import { ConfigSaveDiff } from "./ConfigSaveDiff";
import { useSaveConfig } from "./config.useSave";

const dropdownMenuStyles = css`
  ${makeReset("ul")};
  width: ${makeRem(350)};
  padding: ${makeRem(8)};

  button {
    ${makeReset("button")};
    text-align: left;
    padding: ${makeRem(12)} !important;
    cursor: pointer;

    display: grid;
    grid-template-columns: ${makeRem(38)} auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "icon title"
      "icon subtitle";
    gap: ${makeRem(8)};
    border-radius: ${makeRem(4)};
    transition: all 0.15s ease-in-out;

    &:hover {
      background: ${makeColor("primary-300", { opacity: 0.3 })};
    }

    .icon {
      grid-area: icon;
      display: grid;
      place-content: center;
    }
    .title {
      grid-area: title;
      font-weight: ${makeFontWeight("semi-bold")};
      font-size: ${makeRem(16)};
    }
    .subtitle {
      grid-area: subtitle;
      white-space: break-spaces;
      font-size: ${makeRem(14)};
      color: ${makeColor("neutral-light", { opacity: 0.8 })};
    }
  }
`;

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
        dxLabel="Save"
      >
        <ul className={dropdownMenuStyles}>
          <li>
            <button onClick={openModal} type="button">
              <div className="icon">
                <IconInspectCode dxSize={28} />
              </div>
              <div className="title">Compare and Save</div>
              <div className="subtitle">
                View & edit the diff between the last saved version and your
                current changes
              </div>
            </button>
          </li>
        </ul>
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
