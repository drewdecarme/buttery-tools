import {
  getHueFromHex,
  hsbToHex,
} from "commands/_helpers/utils/util.color-conversions";
import { produce } from "immer";
import { useColorContext } from "./Color.context";

export function ColorSelectHues() {
  const { setState, state } = useColorContext();
  return Object.entries(state.application.hues).map(([hue, hueValue]) => {
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
                draft.application.hues[hue] = getHueFromHex(value);
              })
            );
          }}
        />
      </label>
    );
  });
}
