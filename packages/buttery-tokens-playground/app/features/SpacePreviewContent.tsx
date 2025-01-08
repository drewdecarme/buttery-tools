import { useConfigurationContext } from "./Config.context";
import { SpacePreviewContentVariants } from "./SpacePreviewContentVariants";

export function SpacePreviewContent() {
  const { sizeAndSpace } = useConfigurationContext();
  switch (sizeAndSpace.space.mode) {
    case "auto":
      return (
        <SpacePreviewContentVariants
          variants={sizeAndSpace.space.auto.variants}
          baseFontSize={sizeAndSpace.baseFontSize}
        />
      );

    case "manual":
      return (
        <SpacePreviewContentVariants
          variants={sizeAndSpace.space.manual.variants}
          baseFontSize={sizeAndSpace.baseFontSize}
        />
      );
    default:
      break;
  }
}
