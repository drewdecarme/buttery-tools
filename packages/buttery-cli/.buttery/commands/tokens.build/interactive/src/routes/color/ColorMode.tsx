import { match } from "ts-pattern";
import { useColorContext } from "./Color.context";
import { ColorModePresets } from "./ColorModePresets";

export function ColorMode() {
  const { state, setState } = useColorContext();

  return match(state)
    .with({ mode: "presets" }, (state) => (
      <ColorModePresets state={state} setState={setState} />
    ))
    .with({ mode: "harmonious" }, (state) => <div>TODO: Harmonious</div>)
    .exhaustive();
}
