import { useMemo } from "react";
import {
  type ManualFontStylesValue,
  manualFontStyles,
} from "@buttery/tokens-utils/schemas";
import { exhaustiveMatchGuard, useToggle } from "@buttery/components";
import { produce } from "immer";
import { css } from "@linaria/core";
import { makeColor, makeRem } from "@buttery/tokens/playground";

import { Button } from "~/components/Button";
import { VariantContainer } from "~/components/VariantContainer";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { VariantContainerBarTitle } from "~/components/VariantContainerBarTitle";
import { VariantContainerBarActions } from "~/components/VariantContainerBarActions";
import { VariantContainerContent } from "~/components/VariantContainerContent";
import { IconDelete } from "~/icons/IconDelete";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";
import { InputLabel } from "~/components/InputLabel";
import { InputSelect } from "~/components/InputSelect";
import { InputNumber } from "~/components/InputNumber";
import { InputGroup } from "~/components/InputGroup";
import { InputText } from "~/components/InputText";

import type {
  ConfigurationStateFont,
  ConfigurationStateFontManualFamilyValues,
  ConfigurationStateFontVariantValue,
  OnFontVariantAction,
} from "./config.utils.font";

const barStyles = css`
  grid-template-columns: ${makeRem(80)} 1fr auto;

  .meta {
    font-size: ${makeRem(12)};
    color: ${makeColor("neutral-light", { opacity: 0.7 })};
  }
`;

export type FontVariantConfigVariantProps =
  ConfigurationStateFontVariantValue & {
    variantId: string;
    state: ConfigurationStateFont;
    onAction: OnFontVariantAction;
  };

type WeightsAndStyles = {
  weights: {
    [key in keyof Partial<ManualFontStylesValue>]: {
      value: string;
      display: string;
    };
  };
  styles: { [key: string]: { value: string; display: string } };
};

export function FontVariantConfigVariant({
  variantId,
  variantName,
  state,
  family,
  lineHeight,
  size,
  weight,
  onAction,
}: FontVariantConfigVariantProps) {
  const [isOpen, toggle] = useToggle();

  const families = useMemo(() => {
    switch (state.source) {
      case "manual":
        return Object.values(state.families).map((family) => family.name);

      case "adobe":
      case "google":
        return Object.values(state.families).map((family) => family.name);

      default:
        return exhaustiveMatchGuard(state);
    }
  }, [state]);

  const { weights, styles } = useMemo<WeightsAndStyles>(() => {
    let selectedFamily: ConfigurationStateFontManualFamilyValues | undefined =
      undefined;
    switch (state.source) {
      case "manual":
        selectedFamily = Object.values(state.families).reduce<
          ConfigurationStateFontManualFamilyValues | undefined
        >(
          (accum, familyDef) => (familyDef.name === family ? familyDef : accum),
          undefined
        );
        break;

      case "adobe":
      case "google":
        // selectedFamily = Object.values(state.families).reduce<
        //   ConfigurationStateFontManualFamilyValues | undefined
        // >(
        //   (accum, familyDef) => (familyDef.name === family ? familyDef : accum),
        //   undefined
        // );
        break;

      default:
        return exhaustiveMatchGuard(state);
    }
    if (!selectedFamily) {
      throw "Cannot determine the family from the selection. This should not have happened.";
    }

    return Object.keys(selectedFamily.styles).reduce<WeightsAndStyles>(
      (accum, styleString) => {
        const [weightName, weightValue, rawStyle] = styleString.split("-");
        const weight =
          `${weightName}-${weightValue}` as keyof ManualFontStylesValue;
        console.log(weight);
        const style = rawStyle || "regular";

        return produce(accum, (draft) => {
          if (!draft.weights[weight]) {
            draft.weights[weight] = {
              value: weight,
              display: manualFontStyles[weight],
            };
          }
          if (!draft.styles[style]) {
            draft.styles[style] = {
              value: style,
              display: style,
            };
          }
        });
      },
      { weights: {}, styles: {} } as WeightsAndStyles
    );
  }, [family, state]);

  return (
    <VariantContainer>
      <VariantContainerBar className={barStyles}>
        <VariantContainerBarTitle>{variantName}</VariantContainerBarTitle>
        <div className="meta">
          {family} / {size} / {weight} / {lineHeight}
        </div>
        {useMemo(
          () => (
            <VariantContainerBarActions>
              <Button
                dxVariant="icon"
                DXIcon={IconPencilEdit01}
                onClick={toggle}
                dxSize="dense"
                dxHelp="Edit variant"
              />
              <Button
                dxVariant="icon"
                DXIcon={IconDelete}
                dxSize="dense"
                dxHelp="Delete variant"
              />
            </VariantContainerBarActions>
          ),
          [toggle]
        )}
      </VariantContainerBar>
      {isOpen && (
        <VariantContainerContent>
          <InputGroup>
            <InputLabel
              dxLabel="Variant Name"
              dxSize="dense"
              dxHelp="body1, display2, caption, etc..."
            >
              <InputText dxSize="dense" defaultValue={variantName} />
            </InputLabel>
            <InputLabel dxLabel="Font Family" dxSize="dense">
              <InputSelect dxSize="dense" defaultValue={family}>
                {families.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </InputSelect>
            </InputLabel>
            <InputLabel dxLabel="Size" dxSize="dense">
              <InputNumber dxSize="dense" defaultValue={size} />
            </InputLabel>
            <InputLabel dxLabel="Font Weight" dxSize="dense">
              <InputSelect dxSize="dense" defaultValue={family}>
                {Object.values(weights).map((weight) => (
                  <option key={weight.value} value={weight.value}>
                    {weight.display}
                  </option>
                ))}
              </InputSelect>
            </InputLabel>
            <InputLabel dxLabel="Font style" dxSize="dense">
              <InputSelect dxSize="dense" defaultValue={family}>
                {Object.values(styles).map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.display}
                  </option>
                ))}
              </InputSelect>
            </InputLabel>
          </InputGroup>
        </VariantContainerContent>
      )}
    </VariantContainer>
  );
}
