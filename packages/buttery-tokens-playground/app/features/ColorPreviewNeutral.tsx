import { createNeutralVariants } from "@buttery/tokens-utils";

import { useConfigurationContext } from "./Config.context";
import { ColorPreview } from "./ColorPreview";

export function ColorPreviewNeutral() {
  const { color } = useConfigurationContext();

  const variants = createNeutralVariants(
    Object.values(color.neutral).reduce(
      (accum, { name, ...restDef }) =>
        Object.assign(accum, { [name]: restDef }),
      {}
    )
  );
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
