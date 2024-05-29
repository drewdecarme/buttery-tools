import { produce } from "immer";
import { getHueFromHex, hsbToHex } from "src/utils/util.color-conversions";
import { useConfigColorContext } from "./ConfigColor.context";

export function ConfigColorSelectHues() {
  const { setState, state } = useConfigColorContext();
  return Object.entries(state.hues).map(([hue, hueValue]) => {
    const hex = hsbToHex(hueValue, state.saturation, state.brightness);
    return (
      <label key={hue}>
        <div>
          {hue}: {hueValue}
        </div>
        <input
          type="color"
          value={hex}
          onChange={({ currentTarget: { value } }) => {
            setState(
              produce((draft) => {
                draft.hues[hue] = getHueFromHex(value);
              })
            );
          }}
        />
      </label>
    );
  });
}
