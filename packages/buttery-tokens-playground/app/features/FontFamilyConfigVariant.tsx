import { makeRem, makeColor } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler, ReactNode } from "react";
import { useCallback, useMemo } from "react";

import { Button } from "~/components/Button";
import { InputGroup } from "~/components/InputGroup";
import { InputRadioTab } from "~/components/InputRadioTab";
import { InputRadioTabs } from "~/components/InputRadioTabs";
import { VariantContainer } from "~/components/VariantContainer";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { VariantContainerBarActions } from "~/components/VariantContainerBarActions";
import { VariantContainerBarTitle } from "~/components/VariantContainerBarTitle";
import { VariantContainerContent } from "~/components/VariantContainerContent";
import { IconDelete } from "~/icons/IconDelete";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";

import type {
  ConfigurationStateFont,
  ConfigurationStateFontFamilyValuesMeta,
  OnFontFamilyAction,
} from "./config.utils.font";

const variantStyles = css`
  grid-template-columns: ${makeRem(100)} 1fr !important;

  .family-name {
    align-content: start;
    text-align: left;
    font-size: ${makeRem(14)};
    color: ${makeColor("neutral-light", { opacity: 0.5 })};
  }
`;

export type FontFamilyConfigVariantProps =
  ConfigurationStateFontFamilyValuesMeta & {
    id: string;
    name: string;
    source: ConfigurationStateFont["source"];
    onAction: OnFontFamilyAction;
  };

export function FontFamilyConfigVariant(
  props: FontFamilyConfigVariantProps & {
    children: ReactNode;
  }
) {
  // const fallbackRef = useRef<HTMLInputElement | null>(null);

  // const handleToggleFallback = useCallback<
  //   ChangeEventHandler<HTMLInputElement>
  // >(
  //   ({ currentTarget: { checked } }) => {
  //     props.onAction({
  //       action: "changeFallback",
  //       id: props.id,
  //       fallback: checked ? "" : undefined,
  //     });
  //     if (checked) {
  //       setTimeout(() => fallbackRef.current?.focus(), 100);
  //     }
  //   },
  //   [props]
  // );

  // const handleChangeFallback = useCallback<
  //   ChangeEventHandler<HTMLInputElement>
  // >(
  //   ({ currentTarget: { value } }) => {
  //     props.onAction({
  //       action: "changeFallback",
  //       id: props.id,
  //       fallback: value,
  //     });
  //   },
  //   [props]
  // );

  const handleChangeSource = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      props.onAction({
        action: "changeSource",
        source: value as ConfigurationStateFont["source"],
      });
    },
    [props]
  );

  const handleToggle = useCallback(() => {
    props.onAction({
      action: "toggle",
      id: props.id,
    });
  }, [props]);

  return (
    <VariantContainer>
      <VariantContainerBar className={variantStyles}>
        <VariantContainerBarTitle>{props.name}</VariantContainerBarTitle>
        {useMemo(
          () => (
            <VariantContainerBarActions>
              <Button
                dxVariant="icon"
                DXIcon={IconPencilEdit01}
                onClick={handleToggle}
                dxSize="dense"
                dxHelp="Toggle edit family"
              />
              <Button
                dxVariant="icon"
                DXIcon={IconDelete}
                dxSize="dense"
                dxHelp="Delete family"
              />
            </VariantContainerBarActions>
          ),
          [handleToggle]
        )}
      </VariantContainerBar>
      {props.meta.isOpen && (
        <VariantContainerContent>
          <InputGroup>
            <InputRadioTabs>
              <InputRadioTab
                defaultChecked={props.source === "manual"}
                dxSize="dense"
                name="type"
                dxLabel="Manual"
                dxSubLabel="Custom family, weights, and styles"
                value="manual"
                onChange={handleChangeSource}
              />
              <InputRadioTab
                dxSize="dense"
                defaultChecked={props.source !== "manual"}
                name="type"
                dxLabel="Registries"
                dxSubLabel="Select from Google, Adobe, etc..."
                value="google"
                onChange={handleChangeSource}
              />
            </InputRadioTabs>
            {props.children}

            {/* <InputLabel
              dxLabel="Include a fallback?"
              dxSize="dense"
              dxHelp="Customize the fallback font if the font-family fails to load"
            >
              <div className={inlineField}>
                <InputCheckbox
                  checked={typeof props.fallback !== "undefined"}
                  onChange={handleToggleFallback}
                />
                <InputText
                  ref={fallbackRef}
                  dxSize="dense"
                  dxType="text"
                  disabled={typeof props.fallback === "undefined"}
                  value={props.fallback}
                  onChange={handleChangeFallback}
                />
              </div>
            </InputLabel> */}
          </InputGroup>
        </VariantContainerContent>
      )}
    </VariantContainer>
  );
}
