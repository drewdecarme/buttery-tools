import { useModal } from "@buttery/components";
import { css } from "@linaria/core";
import { makeColor, makeRem } from "@buttery/tokens/playground";

import { Button } from "~/components/Button";
import { ModalHeader } from "~/components/ModalHeader";
import { Modal } from "~/components/Modal";
import { IconPaintBoard } from "~/icons/IconPaintBoard";
import { ModalBody } from "~/components/ModalBody";
import { InputLabel } from "~/components/InputLabel";
import { InputRadio } from "~/components/InputRadio";
import { InputSection } from "~/components/InputSection";
import { IconLayout01 } from "~/icons/IconLayout01";

import { StyleGuideBasic } from "./style-guide/StyleGuideBasic";
import { StyleGuideControlBar } from "./style-guide/StyleGuideControlBar";

const styles = css`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
`;

const bodyStyles = css`
  display: grid;
  grid-template-columns: auto minmax(min-content, 1fr);
  column-gap: ${makeRem(32)};
  height: 100%;
  overflow: hidden;
  padding-right: 0;
  border-top: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};

  .sidebar {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    background: white;
    min-width: ${makeRem(300)};

    .s-head {
      border-bottom: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};
      height: ${makeRem(80)};
      display: grid;
      align-items: center;
      justify-content: end;
    }
    .s-body {
      padding: ${makeRem(16)} 0;
    }
  }

  .guide {
    background: ${makeColor("neutral-light", { opacity: 0.1 })};
    padding: ${makeRem(32)};
    height: 100%;
    overflow: auto;

    & > div {
      padding: ${makeRem(32)};
      background: white;
      border-radius: ${makeRem(8)};
      max-width: ${makeRem(1280)};
      margin: 0 auto;
    }
  }
`;

export function ConfigStyleGuide() {
  const { openModal, modalRef } = useModal();

  return (
    <>
      <Button
        dxVariant="outlined"
        DXIconStart={IconPaintBoard}
        onClick={openModal}
      >
        Style Guide
      </Button>
      <Modal
        ref={modalRef}
        dxVariant="contain"
        dxSize="full"
        className={styles}
      >
        <ModalHeader>Style Guide</ModalHeader>
        <ModalBody className={bodyStyles}>
          <div className="sidebar">
            <div className="s-head">
              <StyleGuideControlBar />
            </div>
            <div className="s-body">
              <InputSection>
                <InputLabel
                  dxLabel="Choose template"
                  dxHelp="Select a layout template to view the guide in different layouts"
                />
                <div>
                  <InputRadio
                    dxVariant="block"
                    DXIcon={IconLayout01}
                    defaultChecked
                    name="layout"
                    value="basic"
                    dxTextPrimary="Basic"
                    dxTextSecondary="A basic layout that displays some sections headers along with it's content"
                  />
                </div>
              </InputSection>
            </div>
          </div>
          <div className="guide">
            <StyleGuideBasic />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
