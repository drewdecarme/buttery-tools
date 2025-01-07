import { InputGroup } from "~/components/InputGroup";

import type { ConfigurationStateSizeManual } from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import { SpaceConfigVariants } from "./SpaceConfigVariants";

export function SpaceConfigManual({
  baseFontSize,
  state,
  setSize,
}: {
  baseFontSize: number;
  state: ConfigurationStateSizeManual;
  setSize: ConfigurationContextType["setSize"];
}) {
  return (
    <InputGroup>
      <SpaceConfigVariants
        mode="manual"
        setSize={setSize}
        variants={state.variants}
        baseFontSize={baseFontSize}
      />
    </InputGroup>
  );
}
