import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { useCallback } from "react";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";
import { match } from "ts-pattern";
import { manualFontStyles } from "@buttery/tokens-utils/schemas";

import { Button } from "~/components/Button";
import { VariantEmpty } from "~/components/VariantEmpty";
import { VariantAdd } from "~/components/VariantAdd";
import { IconPlusSign } from "~/icons/IconPlusSign";
import { LOG } from "~/utils/util.logger";

import { FontFamilyConfigManual } from "./FontFamilyConfigManual";
import { FontFamilyConfigRegistry } from "./FontFamilyConfigRegistry";

import { useConfigurationContext } from "../Config.context";
import type { OnFontFamilyAction } from "../config.utils.font";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function FontFamilyConfig() {
  const { font, setFont } = useConfigurationContext();

  const handleAction = useCallback<OnFontFamilyAction>(
    (args) => {
      switch (args.action) {
        case "addFontFamily":
          setFont((draft) => {
            draft.source = "manual";
            draft.families[generateGUID()] = {
              name: "Arial",
              fallback: undefined,
              styles: {
                "regular-400": {
                  display: manualFontStyles["regular-400"],
                },
              },
              meta: {
                isOpen: true,
              },
            };
          });
          break;

        case "deleteFontFamily": {
          setFont((draft) => {
            const familyToDelete = draft.families[args.id];
            const isFontFamilyInVariants = Object.values(draft.variants).reduce(
              (accum, variant) => {
                if (variant.family === familyToDelete.name) return true;
                return accum;
              },
              false
            );
            if (isFontFamilyInVariants) {
              LOG.error(
                "Cannot delete this family since it is a part of the variants. Please delete the variants that include the family and try again."
              );
              return;
            }

            delete draft.families[args.id];
          });
          break;
        }

        case "toggle": {
          setFont((draft) => {
            draft.families[args.id].meta.isOpen =
              !draft.families[args.id].meta.isOpen;
          });
          break;
        }

        case "addStyle": {
          setFont((draft) => {
            // @ts-expect-error this is going to be okay TODO: Enable Types
            draft.families[args.id].styles[args.style] = {
              // @ts-expect-error this is going to be okay TODO: Enable Types
              display: manualFontStyles[args.style],
            };
          });
          break;
        }

        case "deleteStyle": {
          setFont((draft) => {
            // @ts-expect-error this is going to be okay
            delete draft.families[args.id].styles[args.style];
          });
          break;
        }

        case "changeSource":
          setFont((draft) => {
            draft.source = args.source;
          });
          break;

        case "changeFontFamily":
          setFont((draft) => {
            draft.families[args.id].name = args.fontFamily;
          });
          break;

        case "changeFallback":
          setFont((draft) => {
            draft.families[args.id].fallback = args.fallback;
          });
          break;

        default:
          exhaustiveMatchGuard(args);
      }
    },
    [setFont]
  );

  const handleAddFontFamily = useCallback(
    () => handleAction({ action: "addFontFamily" }),
    [handleAction]
  );

  // Show an empty state if there are no families added
  if (Object.entries(font.families).length === 0) {
    return (
      <VariantEmpty dxMessage="No font families have been added yet">
        <Button
          dxVariant="outlined"
          dxColor="secondary"
          DXIconStart={IconPlusSign}
          onClick={handleAddFontFamily}
        >
          Click to add a font family
        </Button>
      </VariantEmpty>
    );
  }

  return (
    <ul className={styles}>
      {match(font)
        .with({ source: "manual" }, (state) =>
          Object.entries(state.families).map(([familyId, family]) => (
            <li key={familyId}>
              <FontFamilyConfigManual
                {...family}
                id={familyId}
                source={state.source}
                onAction={handleAction}
              />
            </li>
          ))
        )
        .otherwise((state) =>
          Object.entries(state.families).map(([familyId, family]) => (
            <li key={familyId}>
              <FontFamilyConfigRegistry
                {...family}
                id={familyId}
                source={state.source}
                onAction={handleAction}
              />
            </li>
          ))
        )}
      <VariantAdd onAdd={handleAddFontFamily}>Add a font family</VariantAdd>
    </ul>
  );
}
