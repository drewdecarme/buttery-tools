import { ColorPreviewBlocks } from "./ColorPreviewBlocks";

import { useConfigurationContext } from "../Config.context";
import { convertNeutralColorIntoVariants } from "../config.utils.color";

export function ColorPreviewNeutral() {
  const { color } = useConfigurationContext();
  const variants = convertNeutralColorIntoVariants(color);

  return Object.entries(variants).map(
    ([colorName, { base: baseVariantHex, ...restVariants }], i) => {
      return (
        <ColorPreviewBlocks
          key={colorName.concat(`-${i}`)}
          colorName={colorName}
          baseVariantHex={baseVariantHex}
          variants={restVariants}
        />
      );
    }
  );
}
