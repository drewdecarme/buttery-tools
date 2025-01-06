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
    <SpaceConfigVariants
      variants={state.variants}
      baseFontSize={baseFontSize}
    />
  );
}
