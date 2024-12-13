import { css } from "@linaria/core";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/playground";
import { generateGUID } from "@buttery/utils/isomorphic";

import { ColorSwatchAdd } from "./ColorSwatchAdd";
import { ColorBrandModeManualSwatch } from "./ColorBrandModeManualSwatch";
import type { ConfigurationContextType } from "./Config.context";
import type { ConfigurationStateColorBrandColorsManual } from "./config.utils";
import { InputLabel } from "./InputLabel";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  border: ${makeRem(1)} solid ${makeColor("neutral-light", { opacity: 0.1 })};
  border-radius: ${makeRem(4)};

  & > li {
    width: 100%;
    & + li {
      border-top: ${makeRem(1)} solid
        ${makeColor("neutral-light", { opacity: 0.1 })};
    }
    &:last-child {
      button {
        padding: ${makeRem(16)};
        background: ${makeColor("neutral-light", { opacity: 0.05 })};
        width: 100%;
      }
    }
  }
`;

export function ColorBrandModeManual({
  state,
  setColor,
}: {
  state: ConfigurationStateColorBrandColorsManual;
  setColor: ConfigurationContextType["setColor"];
}) {
  return (
    <>
      <InputLabel
        dxLabel="Add brand colors to your color palette"
        dxHelp="You can configure each color's base value, name, and how variants are created."
      />
      <ul className={styles}>
        {Object.entries(state).map(([colorId, colorNameAndDef]) => {
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
                draft.brand.manual[id] = {
                  hex: "#000000",
                  name: `brand${Object.entries(state).length + 1}`,
                  variants: 10,
                };
              })
            }
          />
        </li>
      </ul>
    </>
  );
}
