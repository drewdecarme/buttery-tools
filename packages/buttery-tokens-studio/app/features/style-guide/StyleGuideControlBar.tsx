import { makeColor, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";

import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { IconDownload05 } from "~/icons/IconDownload05";
import { IconLayout01 } from "~/icons/IconLayout01";
import { IconLayout2Column } from "~/icons/IconLayout2Column";
import { IconWebDesign01 } from "~/icons/IconWebDesign01";

const styles = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > * {
    & + * {
      padding-left: ${makeRem(16)};
      margin-left: ${makeRem(16)};
      border-left: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
    }
  }
`;

export function StyleGuideControlBar() {
  return (
    <div className={styles}>
      <ButtonGroup>
        <Button
          dxVariant="icon"
          DXIcon={IconLayout01}
          dxSize="big"
          dxStyle="outlined"
        />
        <Button
          dxVariant="icon"
          DXIcon={IconLayout2Column}
          dxSize="big"
          dxStyle="outlined"
        />
        <Button
          dxVariant="icon"
          DXIcon={IconWebDesign01}
          dxSize="big"
          dxStyle="outlined"
        />
      </ButtonGroup>
      <ButtonGroup>
        <Button
          dxVariant="icon"
          DXIcon={IconDownload05}
          dxSize="big"
          dxHelp="Export to PDF"
        />
      </ButtonGroup>
    </div>
  );
}
