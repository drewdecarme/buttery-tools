import { useConfigurationContext } from "./Config.context";
import { SpacePreviewContentVariants } from "./SpacePreviewContentVariants";

export function SpacePreviewContent() {
  const { size } = useConfigurationContext();
  switch (size.mode) {
    case "auto":
      return (
        <SpacePreviewContentVariants
          variants={size.auto.variants}
          baseFontSize={size.documentFontSize}
        />
      );

    case "manual":
      return (
        <SpacePreviewContentVariants
          variants={size.manual.variants}
          baseFontSize={size.documentFontSize}
        />
      );
    default:
      break;
  }
}
