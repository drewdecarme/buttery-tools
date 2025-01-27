import { ColorPreviewBlocks } from "./ColorPreviewBlocks";
import { ColorPreviewContainer } from "./ColorPreviewContainer";

import { useConfigurationContext } from "../Config.context";
import { convertBrandColorIntoVariants } from "../config.utils.color";

export function ColorPreviewBrand() {
  const { color } = useConfigurationContext();
  const variants = convertBrandColorIntoVariants(color);

  return (
    <ColorPreviewContainer>
      {Object.entries(variants).map(
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
      )}
    </ColorPreviewContainer>
  );
}
