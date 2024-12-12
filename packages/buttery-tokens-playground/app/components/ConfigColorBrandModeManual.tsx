import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { useCallback } from "react";
import type { MouseEventHandler } from "react";
import { generateGUID } from "@buttery/utils/isomorphic";

import { ColorSwatchAdd } from "./ColorSwatchAdd";
import { ConfigColorBrandModeManualSwatch } from "./ConfigColorBrandModeManualSwatch";
import type { ConfigurationContextType } from "./Config.context";
import type { ConfigurationStateColorBrandColorsManual } from "./config.utils";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
  margin-top: ${makeRem(16)};
`;

export function ConfigColorBrandModeManual({
  state,
  setColor,
}: {
  state: ConfigurationStateColorBrandColorsManual;
  setColor: ConfigurationContextType["setColor"];
}) {
  const handleOnAdd = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    setColor((draft) => {
      const id = generateGUID();
      draft.brand.manual[id] = {
        hex: "#000000",
        name: "another",
        variants: 10,
      };
    });
  }, [setColor]);

  return (
    <ul className={styles}>
      {Object.entries(state).map(([colorId, colorNameAndDef]) => {
        return (
          <ConfigColorBrandModeManualSwatch
            key={colorId}
            colorDef={{ [colorId]: colorNameAndDef }}
            setColor={setColor}
          />
        );
      })}
      <li>
        <ColorSwatchAdd onClick={handleOnAdd} />
      </li>
    </ul>
  );
}
