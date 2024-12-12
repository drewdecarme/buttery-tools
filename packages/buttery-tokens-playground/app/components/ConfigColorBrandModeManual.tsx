import type { ButteryTokensConfigColorBrandTypeManual } from "@buttery/tokens-utils/schemas";
import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";

import { ConfigColorSwatch } from "./ConfigColorSwatch";
import { ConfigColorSwatchAdd } from "./ConfigColorSwatchAdd";
import { ConfigColorSwatchHex } from "./ConfigColorSwatchHex";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(16)};
  margin-top: ${makeRem(16)};
`;

export function ConfigColorBrandModeManual({
  state,
}: {
  state: ButteryTokensConfigColorBrandTypeManual;
}) {
  return (
    <ul className={styles}>
      {Object.entries(state.colors).map(([colorName, { variants, hex }]) => {
        return (
          <ConfigColorSwatch key={colorName}>
            <ConfigColorSwatchHex />
            <ConfigColorSwatchVariants />
          </ConfigColorSwatch>
        );
      })}
      <li>
        <ConfigColorSwatchAdd>Add a color</ConfigColorSwatchAdd>
      </li>
    </ul>
  );
}
