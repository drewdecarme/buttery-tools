import { generateGUID } from "@buttery/utils/isomorphic";

import { InputSection } from "~/components/InputSection";
import { InputLabel } from "~/components/InputLabel";

import { ColorSwatchAdd } from "./ColorSwatchAdd";
import { ColorSwatchList } from "./ColorSwatchList";
import { ColorNeutralSwatch } from "./ColorNeutralSwatch";

import { useConfigurationContext } from "../Config.context";

export function ColorNeutral() {
  const { color, setColor } = useConfigurationContext();
  return (
    <InputSection>
      <InputLabel
        dxLabel="Add neutral colors to your color palette"
        dxHelp="You can configure each color's base value, name, and how variants are created."
      />
      <ColorSwatchList>
        {Object.entries(color.neutral).map(([colorId, colorNameAndDef]) => {
          return (
            <li key={colorId}>
              <ColorNeutralSwatch
                colorDef={{ [colorId]: colorNameAndDef }}
                setColor={setColor}
              />
            </li>
          );
        })}
        <li>
          <ColorSwatchAdd
            onClick={() =>
              setColor((draft) => {
                const id = generateGUID();
                draft.neutral[id] = {
                  hex: "#000000",
                  name: `neutral${Object.entries(color.neutral).length + 1}`,
                  variants: 10,
                };
              })
            }
          />
        </li>
      </ColorSwatchList>
    </InputSection>
  );
}
