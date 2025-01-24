import { InputGroup } from "~/components/InputGroup";

import { SpaceConfigVariants } from "./SpaceConfigVariants";

import type { ConfigurationStateSizeAndSpace_SpaceManual } from "../config.utils.sizing.js";
import type { ConfigurationContextType } from "../Config.context.js";

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
