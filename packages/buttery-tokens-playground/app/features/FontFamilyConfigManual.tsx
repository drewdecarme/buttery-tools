import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { manualFontStyles } from "@buttery/tokens-utils/schemas";

import { InputLabel } from "~/components/InputLabel";
import { InputText } from "~/components/InputText";
import { InputGroup } from "~/components/InputGroup";

import { FontFamilyConfigVariant } from "./FontFamilyConfigVariant";
import type { FontFamilyConfigVariantProps } from "./FontFamilyConfigVariant";
import type { ConfigurationStateFontManualFamilyValues } from "./config.utils.font";
import type { FontFamilyConfigVariantStylesProps } from "./FontFamilyConfigVariantStyles";
import { FontFamilyConfigVariantStyles } from "./FontFamilyConfigVariantStyles";

const inlineField = css`
  display: flex;
  gap: ${makeRem(16)};
`;

const allFontStyles = Object.entries(manualFontStyles).reduce<
  FontFamilyConfigVariantStylesProps["allStyles"]
>((accum, [value, display]) => accum.concat({ value, display }), []);

export function FontFamilyConfigManual<
  T extends ConfigurationStateFontManualFamilyValues
>({
  name,
  id,
  source,
  onAction,
  meta,
  styles,
}: T & FontFamilyConfigVariantProps) {
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
      <InputGroup>
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
        <FontFamilyConfigVariantStyles
          allStyles={allFontStyles}
          selectedStyles={Object.keys(styles)}
          id={id}
          onAction={onAction}
        />
      </InputGroup>
    </FontFamilyConfigVariant>
  );
}
