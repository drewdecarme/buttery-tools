import { createBrandVariants } from "@buttery/tokens-utils";
import { match } from "ts-pattern";

import { ColorPreviewBlocks } from "./ColorPreviewBlocks";
import { ColorPreviewContainer } from "./ColorPreviewContainer";

import { useConfigurationContext } from "../Config.context";

export function ColorPreviewBrand() {
  const { color } = useConfigurationContext();

  return (
    <ColorPreviewContainer>
      {match(color.brand)
        .with({ type: "auto" }, (state) => {
          const variants = createBrandVariants({
            ...state.auto,
            colors: Object.values(state.auto.colors).reduce(
              (accum, { name, ...restDef }) =>
                Object.assign(accum, { [name]: restDef }),
              {}
            ),
          });
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
        })
        .with({ type: "manual" }, (state) => {
          const variants = createBrandVariants({
            type: "manual",
            colors: Object.values(state.manual.colors).reduce(
              (accum, { name, ...restDef }) =>
                Object.assign(accum, { [name]: restDef }),
              {}
            ),
          });
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
        })
        .exhaustive()}
    </ColorPreviewContainer>
  );
}
