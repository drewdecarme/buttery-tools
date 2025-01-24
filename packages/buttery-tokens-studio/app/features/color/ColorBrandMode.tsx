import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { useCallback, useMemo } from "react";
import type { ChangeEventHandler } from "react";
import { match } from "ts-pattern";

import { InputRadioCard } from "~/components/InputRadioCard";
import { IconPencil } from "~/icons/IconPencil";
import { IconMagicWand01 } from "~/icons/IconMagicWand01";

import { ColorBrandModeManual } from "./ColorBrandModeManual";
import { ColorBrandModeAuto } from "./ColorBrandModeAuto";

import { useConfigurationContext } from "../Config.context";
import { InputLabel } from "../../components/InputLabel";
import { InputSection } from "../../components/InputSection";

const groupStyles = css`
  display: flex;
  gap: ${makeRem(16)};

  & > * {
    flex: 1;
  }
`;

export function ColorBrandMode() {
  const { color, setColor } = useConfigurationContext();

  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        draft.brand.type = value === "auto" ? "auto" : "manual";
      });
    },
    [setColor]
  );

  return (
    <>
      {useMemo(
        () => (
          <InputSection>
            <InputLabel
              dxLabel="Select how you would like to create colors"
              dxHelp="Each mode has different controls for adding and configuring colors and variants."
            />
            <div className={groupStyles}>
              <InputRadioCard
                DXIcon={IconPencil}
                dxTitle="Manual"
                dxDescription="Manually add base colors using hex values to statically define variants"
                dxHelp="Best when configuring static colors provided by a design / product team"
                value="manual"
                name="mode"
                defaultChecked={color.brand.type === "manual"}
                onChange={handleOnChange}
              />
              <InputRadioCard
                DXIcon={IconMagicWand01}
                dxTitle="Automatic"
                dxDescription="Select a preset palette 'tone' & add variants derived from tone preset scale."
                dxHelp="Best when starting from scratch without design assets"
                value="auto"
                name="mode"
                defaultChecked={color.brand.type === "auto"}
                onChange={handleOnChange}
              />
            </div>
          </InputSection>
        ),
        [color.brand.type, handleOnChange]
      )}
      {match(color.brand)
        .with({ type: "manual" }, (state) => (
          <ColorBrandModeManual state={state.manual} setColor={setColor} />
        ))
        .with({ type: "auto" }, (state) => (
          <ColorBrandModeAuto state={state.auto} setColor={setColor} />
        ))
        .exhaustive()}
    </>
  );
}
