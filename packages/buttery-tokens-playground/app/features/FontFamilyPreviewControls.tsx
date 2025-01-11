import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";
import { useMemo } from "react";

import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { IconTextCreation } from "~/icons/IconTextCreation";
import { InputRange } from "~/components/InputRange";

import { useFontFamilyPreviewContext } from "./FontFamilyPreview.context";
import { FontFamilyPreviewControlsHelp } from "./FontFamilyPreviewControlsHelp";

const styles = css`
  display: grid;
  grid-template-columns: auto auto;
  gap: ${makeRem(16)};
  align-items: center;
`;

export function FontFamilyPreviewControls() {
  const { setDisplayCustomTextarea, fontSize, setFontSize } =
    useFontFamilyPreviewContext();
  return (
    <div className={styles}>
      <InputRange
        dxDisplayInput
        dxVariant="normal"
        dxDisplayMax
        dxDisplayMin
        max={40}
        min={10}
        dxOnChange={setFontSize}
        defaultValue={fontSize}
      />
      {useMemo(
        () => (
          <ButtonGroup>
            <Button
              dxVariant="icon"
              DXIcon={IconTextCreation}
              onClick={() =>
                setDisplayCustomTextarea((prevState) => !prevState)
              }
              dxStyle="outlined"
              dxSize="normal"
              dxHelp="Customize sample text"
            />
            <FontFamilyPreviewControlsHelp />
          </ButtonGroup>
        ),
        [setDisplayCustomTextarea]
      )}
    </div>
  );
}
