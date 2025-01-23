import { useCallback } from "react";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";
import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";

import { VariantEmpty } from "~/components/VariantEmpty";
import { Button } from "~/components/Button";
import { IconPlusSign } from "~/icons/IconPlusSign";
import { VariantAdd } from "~/components/VariantAdd";

import { CustomConfigVariant } from "./CustomConfigVariant";

import { useConfigurationContext } from "../Config.context";
import type { OnCustomAction } from "../config.utils.custom";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(16)};

  li.add {
    button {
      width: 100%;
    }
  }
`;

export function CustomConfig() {
  const { custom, setCustom } = useConfigurationContext();

  const onCustomAction = useCallback<OnCustomAction>(
    (args) => {
      switch (args.action) {
        case "addToken":
          setCustom((draft) => {
            const numOfTokens = Object.keys(draft).length;
            const newTokenNum = numOfTokens + 1;
            draft[generateGUID()] = {
              type: "string",
              name: `token_${newTokenNum}`,
              description: `token_description_${newTokenNum}`,
              value: "",
            };
          });
          break;

        case "deleteToken":
          setCustom((draft) => {
            delete draft[args.id];
          });
          break;

        case "updateName":
          setCustom((draft) => {
            draft[args.id].name = args.name;
          });
          break;

        case "updateDescription":
          setCustom((draft) => {
            draft[args.id].description = args.description;
          });
          break;

        case "updateValue":
          setCustom((draft) => {
            draft[args.id].value = args.value;
          });
          break;

        case "updateType": {
          setCustom((draft) => {
            const token = draft[args.id];
            token.type = args.type;
            switch (args.type) {
              case "string":
                token.value = "";
                break;

              case "rem":
              case "number":
                token.value = 0;
                break;

              default:
                exhaustiveMatchGuard(args.type);
            }
          });
          break;
        }

        default:
          exhaustiveMatchGuard(args);
      }
    },
    [setCustom]
  );

  const handleAdd = useCallback(() => {
    onCustomAction({ action: "addToken" });
  }, [onCustomAction]);

  const customEntires = Object.entries(custom);
  if (customEntires.length === 0) {
    return (
      <VariantEmpty dxMessage="No custom tokens have been added yet">
        <Button
          dxVariant="outlined"
          dxColor="secondary"
          DXIconStart={IconPlusSign}
          onClick={handleAdd}
        >
          Click to add a custom token
        </Button>
      </VariantEmpty>
    );
  }

  return (
    <ul className={styles}>
      {customEntires.map(([tokenId, tokenDef]) => (
        <li key={tokenId}>
          <CustomConfigVariant
            tokenId={tokenId}
            tokenDef={tokenDef}
            onAction={onCustomAction}
          />
        </li>
      ))}
      <li className="add">
        <VariantAdd onAdd={handleAdd}>Add another custom token</VariantAdd>
      </li>
    </ul>
  );
}
