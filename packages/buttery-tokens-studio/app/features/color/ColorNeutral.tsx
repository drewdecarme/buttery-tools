import { generateGUID } from "@buttery/utils/isomorphic";
import { useCallback } from "react";

import { InputSection } from "~/components/InputSection";
import { InputLabel } from "~/components/InputLabel";
import { VariantAdd } from "~/components/VariantAdd";
import { VariantEmpty } from "~/components/VariantEmpty";
import { VariantList } from "~/components/VariantList";

import { ColorNeutralVariant } from "./ColorNeutralVariant";

import { useConfigurationContext } from "../Config.context";

export function ColorNeutral() {
  const { color, setColor } = useConfigurationContext();

  const colorEntries = Object.entries(color.neutral);

  const handleAdd = useCallback(() => {
    const totalColors = colorEntries.length;
    setColor((draft) => {
      const id = generateGUID();
      draft.neutral[id] = {
        hex: "#000000",
        name: `neutral${totalColors + 1}`,
        variants: 10,
      };
    });
  }, [colorEntries.length, setColor]);

  return (
    <InputSection>
      <InputLabel
        dxLabel="Add neutral colors to your color palette"
        dxHelp="You can configure each color's base value, name, and how variants are created."
      />
      {colorEntries.length === 0 ? (
        <VariantEmpty
          dxMessage="No neutral colors have been added yet"
          dxActionMessage="Click to add a neutral color"
          dxOnAdd={handleAdd}
        />
      ) : (
        <VariantList>
          {colorEntries.map(([colorId, colorNameAndDef]) => {
            return (
              <li key={colorId}>
                <ColorNeutralVariant
                  colorDef={{ [colorId]: colorNameAndDef }}
                  setColor={setColor}
                />
              </li>
            );
          })}
          <li>
            <VariantAdd onAdd={handleAdd}>Add another neutral color</VariantAdd>
          </li>
        </VariantList>
      )}
    </InputSection>
  );
}
