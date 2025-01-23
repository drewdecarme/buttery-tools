import { useToggle } from "@buttery/components";
import { useCallback } from "react";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";
import { match } from "ts-pattern";
import { CustomVariantSchema } from "@buttery/tokens-utils/schemas";

import { Button } from "~/components/Button";
import { VariantContainer } from "~/components/VariantContainer";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { VariantContainerBarActions } from "~/components/VariantContainerBarActions";
import { VariantContainerBarTitle } from "~/components/VariantContainerBarTitle";
import { IconDelete } from "~/icons/IconDelete";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";
import { VariantContainerContent } from "~/components/VariantContainerContent";
import { InputTextarea } from "~/components/InputTextarea";
import { InputLabel } from "~/components/InputLabel";
import { InputText } from "~/components/InputText";
import { InputGroup } from "~/components/InputGroup";
import { InputNumber } from "~/components/InputNumber";
import { InputSelect } from "~/components/InputSelect";

import type {
  ConfigurationStateCustomValue,
  OnCustomAction,
} from "../config.utils.custom";

const barStyles = css`
  grid-template-columns: auto auto 1fr;

  .val {
    font-size: ${makeRem(14)};
  }
`;

const contentStyles = css`
  .type-and-value {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: ${makeRem(16)};
  }
`;

export function CustomConfigVariant({
  tokenDef,
  onAction,
  tokenId,
}: {
  tokenId: string;
  onAction: OnCustomAction;
  tokenDef: ConfigurationStateCustomValue;
}) {
  const [isOpen, toggle] = useToggle();

  const handleDelete = useCallback(() => {
    onAction({ action: "deleteToken", id: tokenId });
  }, [onAction, tokenId]);

  return (
    <VariantContainer>
      <VariantContainerBar className={barStyles}>
        <VariantContainerBarTitle>{tokenDef.name}</VariantContainerBarTitle>
        <div className="val">
          {tokenDef.type} |{" "}
          {match(tokenDef)
            .with({ type: "string" }, ({ value }) => {
              if (value === "") return "empty";
              return value;
            })
            .with({ type: "number" }, ({ value }) => {
              return value;
            })
            .with({ type: "rem" }, ({ value }) => {
              return makeRem(value);
            })
            .exhaustive()}
        </div>
        <VariantContainerBarActions>
          <Button
            dxVariant="icon"
            DXIcon={IconPencilEdit01}
            onClick={toggle}
            dxSize="dense"
            dxHelp="Toggle edit"
          />
          <Button
            dxVariant="icon"
            DXIcon={IconDelete}
            onClick={handleDelete}
            dxSize="dense"
            dxHelp="Delete custom token"
          />
        </VariantContainerBarActions>
      </VariantContainerBar>
      {isOpen && (
        <VariantContainerContent className={contentStyles}>
          <InputGroup>
            <InputLabel dxSize="dense" dxLabel="Token name">
              <InputText
                value={tokenDef.name}
                dxSize="dense"
                onChange={(e) =>
                  onAction({
                    action: "updateName",
                    id: tokenId,
                    name: e.currentTarget.value,
                  })
                }
              />
            </InputLabel>
            <InputLabel
              dxSize="dense"
              dxLabel="Description"
              dxHelp="e.g. The height of the navbar to calculate the sticky top across components"
            >
              <InputTextarea
                value={tokenDef.description}
                dxSize="dense"
                onChange={(e) =>
                  onAction({
                    action: "updateDescription",
                    id: tokenId,
                    description: e.currentTarget.value,
                  })
                }
              />
            </InputLabel>
            <div className="type-and-value">
              <InputLabel dxSize="dense" dxLabel="Type">
                <InputSelect
                  dxSize="dense"
                  value={tokenDef.type}
                  onChange={(e) =>
                    onAction({
                      action: "updateType",
                      id: tokenId,
                      type: e.currentTarget
                        .value as ConfigurationStateCustomValue["type"],
                    })
                  }
                >
                  {CustomVariantSchema._def.options.map((option) => (
                    <option key={option.shape.type.value}>
                      {option.shape.type.value}
                    </option>
                  ))}
                </InputSelect>
              </InputLabel>
              {match(tokenDef)
                .with({ type: "string" }, ({ value }) => (
                  <InputLabel dxSize="dense" dxLabel="Value">
                    <InputText
                      dxSize="dense"
                      value={value}
                      onChange={(e) =>
                        onAction({
                          action: "updateValue",
                          id: tokenId,
                          value: e.currentTarget.value,
                        })
                      }
                    />
                  </InputLabel>
                ))
                .with({ type: "number" }, ({ value }) => (
                  <InputLabel dxSize="dense" dxLabel="Value">
                    <InputNumber
                      dxSize="dense"
                      value={value}
                      onChange={(e) =>
                        onAction({
                          action: "updateValue",
                          id: tokenId,
                          value: Number(e.currentTarget.value),
                        })
                      }
                    />
                  </InputLabel>
                ))
                .with({ type: "rem" }, ({ value }) => (
                  <InputLabel dxSize="dense" dxLabel="Value">
                    <InputNumber
                      dxSize="dense"
                      value={value}
                      onChange={(e) =>
                        onAction({
                          action: "updateValue",
                          id: tokenId,
                          value: Number(e.currentTarget.value),
                        })
                      }
                    />
                  </InputLabel>
                ))
                .exhaustive()}
            </div>
          </InputGroup>
        </VariantContainerContent>
      )}
    </VariantContainer>
  );
}
