import { SpacePreviewContentVariants } from "./SpacePreviewContentVariants";

import { useConfigurationContext } from "../Config.context";

export function SpacePreviewContent() {
  const { sizing } = useConfigurationContext();
  switch (sizing.space.mode) {
    case "auto":
      return (
        <SpacePreviewContentVariants
          variants={sizing.space.auto.variants}
          baseFontSize={sizing.baseFontSize}
        />
      );

    case "manual":
      return (
        <SpacePreviewContentVariants
          variants={sizing.space.manual.variants}
          baseFontSize={sizing.baseFontSize}
        />
      );
    default:
      break;
  }
}
