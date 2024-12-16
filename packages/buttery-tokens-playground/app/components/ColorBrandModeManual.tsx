import { generateGUID } from "@buttery/utils/isomorphic";

import { ColorSwatchAdd } from "./ColorSwatchAdd";
import { ColorBrandModeManualSwatch } from "./ColorBrandModeManualSwatch";
import type { ConfigurationContextType } from "./Config.context";
import type { ConfigurationStateColorBrandManual } from "./config.utils";
import { InputLabel } from "./InputLabel";
import { ColorSwatchList } from "./ColorSwatchList";
import { InputSection } from "./InputGroup";

export function ColorBrandModeManual({
  state,
  setColor,
}: {
  state: ConfigurationStateColorBrandManual;
  setColor: ConfigurationContextType["setColor"];
}) {
  return (
    <InputSection>
      <InputLabel
        dxLabel="Add brand colors to your color palette"
        dxHelp="You can configure each color's base value, name, and how variants are created."
      />
      <ColorSwatchList>
        {Object.entries(state.colors).map(([colorId, colorNameAndDef]) => {
          return (
            <li key={colorId}>
              <ColorBrandModeManualSwatch
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
                draft.brand.manual.colors[id] = {
                  hex: "#000000",
                  name: `brand${Object.entries(state).length + 1}`,
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
