import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { useCallback } from "react";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";

import { VariantContainer } from "~/components/VariantContainer";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { Button } from "~/components/Button";

import { useConfigurationContext } from "./Config.context";
import type { FontFamilyConfigVariantProps } from "./FontFamilyConfigVariant";
import { FontFamilyConfigVariant } from "./FontFamilyConfigVariant";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

const addStyles = css`
  grid-template-columns: 1fr !important;
  button {
    justify-content: flex-start;
  }
`;

export function FontFamilyConfig() {
  const { font, setFont } = useConfigurationContext();

  const handleAction = useCallback<FontFamilyConfigVariantProps["onAction"]>(
    (args) => {
      switch (args.action) {
        case "add":
          setFont((draft) => {
            const familyIndex = Object.values(draft.families).length;
            draft.families[generateGUID()] = {
              fontFamily: "Arial",
              name: "family".concat(String(familyIndex)),
              weights: {},
              fallback: undefined,
            };
          });
          break;

        case "changeName":
          setFont((draft) => {
            draft.families[args.id].name = args.name;
          });
          break;

        case "changeFontFamily":
          setFont((draft) => {
            draft.families[args.id].fontFamily = args.fontFamily;
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

  const handleAddVariant = useCallback(
    () => handleAction({ action: "add" }),
    [handleAction]
  );

  return (
    <ul className={styles}>
      {Object.entries(font.families).map(([fontFamilyId, family]) => {
        return (
          <li key={fontFamilyId}>
            <FontFamilyConfigVariant
              {...family}
              id={fontFamilyId}
              onAction={handleAction}
            />
          </li>
        );
      })}
      <li>
        <VariantContainer dxStyle="alt">
          <VariantContainerBar className={addStyles}>
            <Button
              dxVariant="text"
              dxColor="secondary"
              onClick={handleAddVariant}
            >
              Add a family
            </Button>
          </VariantContainerBar>
        </VariantContainer>
      </li>
    </ul>
  );
}
