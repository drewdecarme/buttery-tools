import { styled } from "@linaria/react";
import { type FC, useMemo } from "react";
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
    state: { hues }
  } = useConfigColorContext();

  return useMemo(
    () => (
      <ColorContainer>
        {Object.entries(hues).map(([hue, hueValue]) => (
          <SColor
            key={`color-${hue}`}
            style={{
              // TODO: Change to the generateTokens.makeColor make color
              // @ts-expect-error no worries since these will conflict since we're conflating 2
              // different design systems
              backgroundColor: generatedTokens.makeColor(hue)
            }}
          />
        ))}
      </ColorContainer>
    ),
    [hues]
  );
};
