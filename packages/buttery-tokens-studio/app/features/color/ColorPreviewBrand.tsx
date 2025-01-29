import { ColorPreviewBlocks } from "./ColorPreviewBlocks";
import { ColorPreviewContainer } from "./ColorPreviewContainer";
import { convertBrandColorIntoVariants } from "./color.utils";

import { useConfigurationContext } from "../Config.context";

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
