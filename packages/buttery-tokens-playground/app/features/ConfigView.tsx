import { useModal } from "@buttery/components";
import { useMemo } from "react";
import { css } from "@linaria/core";
import { makeFontFamily } from "@buttery/tokens/playground";

import { Button } from "~/components/Button";
import { ModalDrawer } from "~/components/ModalDrawer";
import { ModalHeader } from "~/components/ModalHeader";
import { IconView } from "~/icons/IconView";

import { useConfigurationContext } from "./Config.context";
import { highlighter } from "./config.utils";

const codeStyles = css`
  width: 100%;
  overflow: hidden;
  padding: 1rem;
  * {
    font-family: ${makeFontFamily("code")};
  }
`;
const styles = css``;

export function ConfigView() {
  const { openModal, modalRef } = useModal();
  const { getConfig } = useConfigurationContext();

  const configHtml = useMemo(() => {
    const config = getConfig();
    const code = highlighter.codeToHtml(JSON.stringify(config, null, 2), {
      theme: "dark-plus",
      lang: "json",
    });
    return code;
  }, [getConfig]);

  return (
    <>
      <Button
        dxVariant="outlined"
        DXAdornmentStart={<IconView dxSize={16} />}
        onClick={openModal}
      >
        View
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
        <div
          className={codeStyles}
          dangerouslySetInnerHTML={{ __html: configHtml }}
        />
      </ModalDrawer>
    </>
  );
}
