import { styled } from "@linaria/react";
import type { FC } from "react";
import { hsbToHex } from "../../src/utils/util.color-conversions";
import { useConfigColorContext } from "./ConfigColor.context";
import { generatedTokens } from "./tokens-generated";
import { localTokens } from "./tokens-local";

const ColorContainer = styled("div")`
  display: flex;
  width: 100%;
  padding: 0 ${localTokens.makeRem(32)};
`;

const SColor = styled("div")`
  height: ${localTokens.makeRem(120)};
  width: ${localTokens.makeRem(120)};
  flex: 1;
`;

export const ConfigColorPalette: FC = () => {
  const {
    state: { hues, saturation, brightness }
  } = useConfigColorContext();

  return (
    <>
      <div>
        <h3>{"colors (from config)"}</h3>
        <ColorContainer>
          {Object.entries(hues).map(([hue]) => (
            <SColor
              key={`color-${hue}`}
              style={{
                // TODO: Change to the generateTokens.makeColor make color
                // @ts-expect-error no worries since these will conflict since we're conflating 2
                // different design systems
                // NEXT - Create the variants
                backgroundColor: generatedTokens.makeColor(hue)
              }}
            />
          ))}
        </ColorContainer>
      </div>
      <div>
        <h3>{"colors (from picker)"}</h3>
        <ColorContainer>
          {Object.entries(hues).map(([hue, hueValue]) => (
            <SColor
              key={`color-${hue}`}
              style={{
                backgroundColor: hsbToHex(hueValue, saturation, brightness)
              }}
            />
          ))}
        </ColorContainer>
      </div>
    </>
  );
};
