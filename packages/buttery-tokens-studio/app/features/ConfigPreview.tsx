import { useModal } from "@buttery/components";
import { css } from "@linaria/core";
import { makeCustom } from "@buttery/tokens/playground";

import { Button } from "~/components/Button";
import { ModalDrawer } from "~/components/ModalDrawer";
import { ModalHeader } from "~/components/ModalHeader";
import { IconView } from "~/icons/IconView";
import { NavTabs } from "~/components/NavTabs";
import { CodeBlock } from "~/components/CodeBlock";

import { useConfigurationContext } from "./Config.context";

const codeStyles = css`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: ${makeCustom("modal-gutters")};
`;

const styles = css`
  && {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr;
    overflow: hidden;
  }
`;

const tabStyles = css`
  padding: 0 ${makeCustom("modal-gutters")};
`;

export function ConfigPreview() {
  const { openModal, modalRef } = useModal();
  const { getConfigFromState } = useConfigurationContext();
  const config = getConfigFromState();

  return (
    <>
      <Button dxVariant="outlined" DXIconStart={IconView} onClick={openModal}>
        Preview
      </Button>
      <ModalDrawer
        ref={modalRef}
        dxVariant="right-to-left"
        dxSize="md"
        className={styles}
      >
        <ModalHeader dxSubtitle="Below you'll find the code representation of the configuration. You can copy and paste this into your buttery-tokens.config.ts file or you can use one of the other buttons to save it.">
          View the configuration
        </ModalHeader>
        <NavTabs className={tabStyles}>
          <ul>
            <li>
              <button className="active">JSON</button>
            </li>
            <li>
              <button>TypeScript</button>
            </li>
          </ul>
        </NavTabs>
        <CodeBlock
          className={codeStyles}
          dxCode={JSON.stringify(config, null, 2)}
          dxOptions={{ lang: "json" }}
        />
      </ModalDrawer>
    </>
  );
}
