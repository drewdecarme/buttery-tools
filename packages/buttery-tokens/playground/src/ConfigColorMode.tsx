import { match } from "ts-pattern";
import { useConfigColorContext } from "./ConfigColor.context";
import { ConfigColorModePresets } from "./ConfigColorModePresets";

export function ConfigColorMode() {
  const { state, setState } = useConfigColorContext();

  return match(state)
    .with({ mode: "presets" }, (state) => (
      <ConfigColorModePresets state={state} setState={setState} />
    ))
    .with({ mode: "harmonious" }, (state) => <div>TODO: Harmonious</div>)
    .exhaustive();
}
