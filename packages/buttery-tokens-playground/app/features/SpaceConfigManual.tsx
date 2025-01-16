import { InputGroup } from "~/components/InputGroup";

import type { ConfigurationStateSizeAndSpace_SpaceManual } from "./config.utils.sizing.js";
import type { ConfigurationContextType } from "./Config.context";
import { SpaceConfigVariants } from "./SpaceConfigVariants";

export function SpaceConfigManual({
  baseFontSize,
  state,
  setSizing,
}: {
  baseFontSize: number;
  state: ConfigurationStateSizeAndSpace_SpaceManual;
  setSizing: ConfigurationContextType["setSizing"];
}) {
  return (
    <InputGroup>
      <SpaceConfigVariants
        mode="manual"
        setSizing={setSizing}
        variants={state.variants}
        baseFontSize={baseFontSize}
      />
    </InputGroup>
  );
}
