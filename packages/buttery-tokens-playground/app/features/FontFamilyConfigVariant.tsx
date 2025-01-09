import { useToggle } from "@buttery/components";
import { makeRem, makeColor } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";
import { useCallback, useMemo, useRef } from "react";

import { Button } from "~/components/Button";
import { InputCheckbox } from "~/components/InputCheckbox";
import { InputGroup } from "~/components/InputGroup";
import { InputLabel } from "~/components/InputLabel";
import { InputText } from "~/components/InputText";
import { VariantContainer } from "~/components/VariantContainer";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { VariantContainerBarActions } from "~/components/VariantContainerBarActions";
import { VariantContainerBarTitle } from "~/components/VariantContainerBarTitle";
import { VariantContainerContent } from "~/components/VariantContainerContent";
import { IconDelete } from "~/icons/IconDelete";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";

const variantStyles = css`
  grid-template-columns: ${makeRem(100)} 1fr 2fr !important;

  .family-name {
    align-content: start;
    text-align: left;
    font-size: ${makeRem(14)};
    color: ${makeColor("neutral-light", { opacity: 0.5 })};
  }
`;

const inlineField = css`
  display: flex;
  gap: ${makeRem(16)};
`;

export type FontFamilyConfigVariantProps = {
  id: string;
  name: string;
  fontFamily: string;
  fallback?: string;
  onAction: (
    options:
      | { action: "add" }
      | { action: "changeName"; id: string; name: string }
      | { action: "changeFontFamily"; id: string; fontFamily: string }
      | { action: "changeFallback"; id: string; fallback: string | undefined }
  ) => void;
};

export function FontFamilyConfigVariant(props: FontFamilyConfigVariantProps) {
  const [isOpen, toggle] = useToggle();
  const fallbackRef = useRef<HTMLInputElement | null>(null);

  const handleChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      props.onAction({ action: "changeName", id: props.id, name: value });
    },
    [props]
  );

  const handleChangeFontFamily = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      props.onAction({
        action: "changeFontFamily",
        id: props.id,
        fontFamily: value,
      });
    },
    [props]
  );

  const handleToggleFallback = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { checked } }) => {
      props.onAction({
        action: "changeFallback",
        id: props.id,
        fallback: checked ? "" : undefined,
      });
      if (checked) {
        setTimeout(() => fallbackRef.current?.focus(), 100);
      }
    },
    [props]
  );

  const handleChangeFallback = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      props.onAction({
        action: "changeFallback",
        id: props.id,
        fallback: value,
      });
    },
    [props]
  );

  return (
    <VariantContainer>
      <VariantContainerBar className={variantStyles}>
        <VariantContainerBarTitle>{props.name}</VariantContainerBarTitle>
        <div className="family-name">{props.fontFamily}</div>
        {useMemo(
          () => (
            <VariantContainerBarActions>
              <Button
                dxVariant="icon"
                DXIcon={IconPencilEdit01}
                onClick={toggle}
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
          [toggle]
        )}
      </VariantContainerBar>
      {isOpen && (
        <VariantContainerContent>
          <InputGroup>
            <InputLabel
              dxLabel="Token name"
              dxSize="dense"
              dxHelp="Identifies the token within the design system e.g heading, body, etc..."
            >
              <InputText
                dxSize="dense"
                dxType="text"
                value={props.name}
                onChange={handleChangeName}
              />
            </InputLabel>
            <InputLabel
              dxLabel="Font Family"
              dxSize="dense"
              dxHelp="Mullish, Consolas, OpenSans, Lato, etc..."
            >
              <div className={inlineField}>
                <InputText
                  dxSize="dense"
                  dxType="text"
                  value={props.fontFamily}
                  onChange={handleChangeFontFamily}
                />
              </div>
            </InputLabel>
            <InputLabel
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
            </InputLabel>
          </InputGroup>
        </VariantContainerContent>
      )}
    </VariantContainer>
  );
}
