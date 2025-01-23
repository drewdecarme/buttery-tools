import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";
import { useMemo } from "react";

import { ButtonGroup } from "~/components/ButtonGroup";
import { Button } from "~/components/Button";
import { IconLeftToRightListNumber } from "~/icons/IconLeftToRightListNumber";
import { IconParagraph } from "~/icons/IconParagraph";
import { IconIdentityCard } from "~/icons/IconIdentityCard";

import { FontVariantPreviewControlsHelp } from "./FontVariantPreviewControlsHelp";

const styles = css`
  display: grid;
  grid-template-columns: auto auto;
  gap: ${makeRem(16)};
  align-items: center;
`;

export function FontVariantPreviewControls() {
  return (
    <div className={styles}>
      {useMemo(
        () => (
          <>
            <ButtonGroup>
              <Button
                dxVariant="icon"
                DXIcon={IconLeftToRightListNumber}
                dxStyle="outlined"
                dxHelp="View as list"
              />
              <Button
                dxVariant="icon"
                DXIcon={IconIdentityCard}
                dxStyle="outlined"
                dxHelp="View in card"
              />
              <Button
                dxVariant="icon"
                DXIcon={IconParagraph}
                dxStyle="outlined"
                dxHelp="View in article"
              />
            </ButtonGroup>
            <ButtonGroup>
              <FontVariantPreviewControlsHelp />
            </ButtonGroup>
          </>
        ),
        []
      )}
    </div>
  );
}
