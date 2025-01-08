import type { ChangeEventHandler } from "react";
import { useCallback, useMemo } from "react";
import { match } from "ts-pattern";
import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";

import { InputLabel } from "~/components/InputLabel";
import { InputRadioCard } from "~/components/InputRadioCard";
import { InputSection } from "~/components/InputSection";
import { IconMagicWand01 } from "~/icons/IconMagicWand01";
import { IconPencil } from "~/icons/IconPencil";

import { useConfigurationContext } from "./Config.context";
import { SpaceConfigAuto } from "./SpaceConfigAuto";
import { SpaceConfigManual } from "./SpaceConfigManual";

const groupStyles = css`
  display: flex;
  gap: ${makeRem(16)};

  & > * {
    flex: 1;
  }
`;

export function SpaceConfig() {
  const { sizeAndSpace, setSizeAndSpace } = useConfigurationContext();

  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setSizeAndSpace((draft) => {
        draft.space.mode = value === "auto" ? "auto" : "manual";
      });
    },
    [setSizeAndSpace]
  );

  return (
    <>
      {useMemo(
        () => (
          <InputSection>
            <InputLabel dxLabel="Select how you would like to create the spacing constraints" />
            <div className={groupStyles}>
              <InputRadioCard
                DXIcon={IconMagicWand01}
                dxTitle="Automatic"
                dxDescription="Auto derive spacing tokens based upon a set numeric factor"
                dxHelp="Best when starting from scratch without design assets"
                value="auto"
                name="mode"
                defaultChecked={sizeAndSpace.space.mode === "auto"}
                onChange={handleOnChange}
              />
              <InputRadioCard
                DXIcon={IconPencil}
                dxTitle="Manual"
                dxDescription="Manually add named spacing variants & values"
                dxHelp="Best when configuring spacing definitions provided by a design / product team"
                value="manual"
                name="mode"
                defaultChecked={sizeAndSpace.space.mode === "manual"}
                onChange={handleOnChange}
              />
            </div>
          </InputSection>
        ),
        [handleOnChange, sizeAndSpace.space.mode]
      )}
      <InputSection>
        {match(sizeAndSpace.space)
          .with({ mode: "manual" }, (state) => (
            <SpaceConfigManual
              baseFontSize={sizeAndSpace.baseFontSize}
              state={state.manual}
              setSizeAndSpace={setSizeAndSpace}
            />
          ))
          .with({ mode: "auto" }, (state) => (
            <SpaceConfigAuto
              baseFontSize={sizeAndSpace.baseFontSize}
              state={state.auto}
              setSizeAndSpace={setSizeAndSpace}
            />
          ))
          .exhaustive()}
      </InputSection>
    </>
  );
}
