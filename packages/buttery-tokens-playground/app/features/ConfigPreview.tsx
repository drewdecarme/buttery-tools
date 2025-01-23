import { useModal } from "@buttery/components";
import { useEffect, useState } from "react";
import { css } from "@linaria/core";
import {
  makeCustom,
  makeFontFamily,
  makeRem,
} from "@buttery/tokens/playground";
import { codeToHtml } from "shiki";

import { Button } from "~/components/Button";
import { ModalDrawer } from "~/components/ModalDrawer";
import { ModalHeader } from "~/components/ModalHeader";
import { IconView } from "~/icons/IconView";
import { NavTabs } from "~/components/NavTabs";

import { useConfigurationContext } from "./Config.context";

const codeStyles = css`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: ${makeCustom("modal-gutters")};

  * {
    font-family: ${makeFontFamily("Consolas")};
    font-size: ${makeRem(14)};
  }

  pre {
    margin: 0;
    border-radius: ${makeRem(8)};
    padding: ${makeRem(16)};
    height: 100%;
    overflow-x: auto;
  }
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
  const [configHTML, setConfigHTML] = useState<string>("");

  useEffect(() => {
    async function highlightCode() {
      const config = getConfigFromState();
      const configJson = JSON.stringify(config, null, 2);
      const html = await codeToHtml(configJson, {
        theme: "slack-dark",
        lang: "json",
      });
      setConfigHTML(html);
    }

    highlightCode();
  }, [getConfigFromState]);

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
        <div
          className={codeStyles}
          dangerouslySetInnerHTML={{ __html: configHTML }}
        />
      </ModalDrawer>
    </>
  );
}
