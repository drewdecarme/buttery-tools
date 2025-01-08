import { InputGroup } from "~/components/InputGroup";

import type { ConfigurationStateSizeAndSpace_SpaceManual } from "./config.utils";
import type { ConfigurationContextType } from "./Config.context";
import { SpaceConfigVariants } from "./SpaceConfigVariants";

export function SpaceConfigManual({
  baseFontSize,
  state,
  setSizeAndSpace,
}: {
  baseFontSize: number;
  state: ConfigurationStateSizeAndSpace_SpaceManual;
  setSizeAndSpace: ConfigurationContextType["setSizeAndSpace"];
}) {
  return (
    <InputGroup>
      <SpaceConfigVariants
        mode="manual"
        setSizeAndSpace={setSizeAndSpace}
        variants={state.variants}
        baseFontSize={baseFontSize}
      />
    </InputGroup>
  );
}
