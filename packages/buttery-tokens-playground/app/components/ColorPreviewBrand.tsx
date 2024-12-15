import { exhaustiveMatchGuard } from "@buttery/components";
import { createBrandVariants } from "@buttery/tokens-utils";

import { useConfigurationContext } from "./Config.context";
import { ColorPreview } from "./ColorPreview";

export function ColorPreviewBrand() {
  const { color } = useConfigurationContext();

  switch (color.brand.type) {
    case "auto":
      return null;

    case "manual": {
      const variants = createBrandVariants({
        type: "manual",
        colors: Object.values(color.brand.manual.colors).reduce(
          (accum, { name, ...restDef }) =>
            Object.assign(accum, { [name]: restDef }),
          {}
        ),
      });
      return Object.entries(variants).map(
        ([colorName, { base: baseVariantHex, ...restVariants }], i) => {
          return (
            <ColorPreview
              key={colorName.concat(`-${i}`)}
              colorName={colorName}
              baseVariantHex={baseVariantHex}
              variants={restVariants}
            />
          );
        }
      );
    }

    default:
      exhaustiveMatchGuard(color.brand.type);
  }
}
