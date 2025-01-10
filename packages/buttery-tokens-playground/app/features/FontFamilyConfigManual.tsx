import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";
import { useCallback } from "react";

import { InputLabel } from "~/components/InputLabel";
import { InputText } from "~/components/InputText";

import type { ConfigurationStateFontManualFamilyValues } from "./config.utils.font";
import type { FontFamilyConfigVariantProps } from "./FontFamilyConfigVariant";
import { FontFamilyConfigVariant } from "./FontFamilyConfigVariant";

const inlineField = css`
  display: flex;
  gap: ${makeRem(16)};
`;

export function FontFamilyConfigManual<
  T extends ConfigurationStateFontManualFamilyValues
>({ name, id, source, onAction, meta }: T & FontFamilyConfigVariantProps) {
  const handleChangeFontFamily = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      onAction({ action: "changeFontFamily", id, fontFamily: value });
    },
    [id, onAction]
  );

  return (
    <FontFamilyConfigVariant
      id={id}
      name={name}
      source={source}
      meta={meta}
      onAction={onAction}
    >
      <InputLabel
        dxLabel="Family"
        dxSize="dense"
        dxHelp="Mullish, Consolas, OpenSans, Lato, etc..."
      >
        <div className={inlineField}>
          <InputText
            dxSize="dense"
            dxType="text"
            value={name}
            onChange={handleChangeFontFamily}
          />
        </div>
      </InputLabel>
    </FontFamilyConfigVariant>
  );
}
