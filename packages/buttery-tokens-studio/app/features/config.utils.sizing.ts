import { exhaustiveMatchGuard } from "@buttery/components";
import type { SpaceVariantsRecord } from "@buttery/tokens-utils";
import {
  calculateSpaceVariantsAuto,
  calculateSpaceVariantsManual,
} from "@buttery/tokens-utils";
import type {
  ButteryTokensConfig,
  SpaceAuto,
  SpaceManual,
  ButteryTokensConfigSizeAndSpace,
} from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";
import { match } from "ts-pattern";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

export type ConfigurationStateSizeAndSpace_SpaceVariants = {
  [id: string]: {
    name: string;
    value: number;
    order: number;
  };
};
export type ConfigurationStateSizeAndSpace_SpaceAuto = Omit<
  SpaceAuto,
  "variants"
> & {
  variants: ConfigurationStateSizeAndSpace_SpaceVariants;
};
export type ConfigurationStateSizeAndSpace_SpaceManual = Omit<
  SpaceManual,
  "variants"
> & {
  variants: ConfigurationStateSizeAndSpace_SpaceVariants;
};
export type ConfigurationStateSizeAndSpace_SizeVariants = Record<
  string,
  { name: string; value: number }
>;
export type ConfigurationStateSizeAndSpace = Pick<
  ButteryTokensConfigSizeAndSpace,
  "baseFontSize" | "baselineGrid"
> & {
  size: {
    variants: ConfigurationStateSizeAndSpace_SizeVariants;
  };
  space: {
    mode: Required<ButteryTokensConfigSizeAndSpace>["space"]["mode"];
    manual: ConfigurationStateSizeAndSpace_SpaceManual;
    auto: ConfigurationStateSizeAndSpace_SpaceAuto;
  };
};

export function orderSpaceVariants(
  variants: ConfigurationStateSizeAndSpace_SpaceVariants
): ConfigurationStateSizeAndSpace_SpaceVariants {
  return Object.fromEntries(
    Object.entries(variants).sort((a, b) => a[1].order - b[1].order)
  );
}

function convertSpaceVariantConfigIntoState(
  variants: SpaceVariantsRecord
): ConfigurationStateSizeAndSpace_SpaceVariants {
  const spaceVariants = Object.entries(variants).reduce(
    (accum, [variantName, variantValue], i) =>
      Object.assign(accum, {
        [generateGUID()]: {
          name: variantName,
          value: variantValue,
          order: i,
        },
      }),
    {}
  );
  const orderedVariants = orderSpaceVariants(spaceVariants);
  return orderedVariants;
}

function createSpaceAutoVariantsFromConfig(
  variants: number | string[],
  baselineGrid: number,
  factor?: number
): ConfigurationStateSizeAndSpace_SpaceAuto["variants"] {
  const autoVariants = calculateSpaceVariantsAuto(
    variants,
    baselineGrid,
    factor
  );
  const state = convertSpaceVariantConfigIntoState(autoVariants);
  return state;
}

function createSpaceManualVariantsFromConfig(
  variants: Record<string, number>
): ConfigurationStateSizeAndSpace_SpaceManual["variants"] {
  const manualVariants = calculateSpaceVariantsManual(variants);
  return convertSpaceVariantConfigIntoState(manualVariants);
}

function createSizeVariantsFromConfig(
  variants: ButteryTokensConfig["sizeAndSpace"]["size"]["variants"]
): ConfigurationStateSizeAndSpace_SizeVariants {
  return Object.fromEntries(
    Object.entries(variants).map(([variantName, variantValue]) => [
      generateGUID(),
      { name: variantName, value: variantValue },
    ])
  );
}

export function getInitStateSizeAndSpaceFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateSizeAndSpace {
  switch (config.sizeAndSpace.space.mode) {
    case "auto": {
      const spaceVariants = createSpaceAutoVariantsFromConfig(
        config.sizeAndSpace.space.variants,
        config.sizeAndSpace.baselineGrid,
        config.sizeAndSpace.space.factor
      );
      return {
        baseFontSize: config.sizeAndSpace.baseFontSize,
        baselineGrid: config.sizeAndSpace.baselineGrid,
        size: {
          variants: createSizeVariantsFromConfig(
            config.sizeAndSpace.size.variants
          ),
        },
        space: {
          mode: config.sizeAndSpace.space.mode,
          auto: {
            mode: "auto",
            factor: config.sizeAndSpace.space.factor,
            variants: spaceVariants,
          },
          manual: {
            mode: "manual",
            variants: createSpaceManualVariantsFromConfig({
              sm: 4,
              md: 8,
              lg: 12,
            }),
          },
        },
      };
    }

    case "manual": {
      return {
        baseFontSize: config.sizeAndSpace.baseFontSize,
        baselineGrid: config.sizeAndSpace.baselineGrid,
        size: {
          variants: createSizeVariantsFromConfig(
            config.sizeAndSpace.size.variants
          ),
        },
        space: {
          mode: config.sizeAndSpace.space.mode,
          auto: {
            mode: "auto",
            variants: createSpaceAutoVariantsFromConfig(
              10,
              config.sizeAndSpace.baselineGrid
            ),
          },
          manual: {
            mode: "manual",
            variants: createSpaceManualVariantsFromConfig(
              config.sizeAndSpace.space.variants
            ),
          },
        },
      };
    }

    default:
      return exhaustiveMatchGuard(config.sizeAndSpace.space);
  }
}

export function getSizeAndSpaceConfigFromState(
  state: ConfigurationStateSizeAndSpace
): ButteryTokensConfig["sizeAndSpace"] {
  const space = match<
    ConfigurationStateSizeAndSpace["space"],
    ButteryTokensConfig["sizeAndSpace"]["space"]
  >(state.space)
    .with({ mode: "auto" }, (state) => ({
      mode: "auto",
      factor: state.auto.factor,
      variants: Object.values(state.auto.variants).map(({ name }) => name),
    }))
    .with({ mode: "manual" }, (state) => ({
      mode: "manual",
      variants: Object.values(state.manual.variants).reduce(
        (accum, { name, value }) => Object.assign(accum, { [name]: value }),
        {}
      ),
    }))
    .exhaustive();

  const size = {
    variants: Object.values(state.size.variants).reduce<
      ButteryTokensConfig["sizeAndSpace"]["size"]["variants"]
    >((accum, { name, value }) => Object.assign(accum, { [name]: value }), {}),
  };

  return {
    baseFontSize: state.baseFontSize,
    baselineGrid: state.baselineGrid,
    size,
    space,
  };
}

export function useConfigStateSizing(initConfig: ButteryTokensConfig) {
  const state = getInitStateSizeAndSpaceFromConfig(initConfig);
  return useImmer(state);
}
export type ConfigurationContextSizingType = {
  sizing: ConfigurationStateSizeAndSpace;
  setSizing: Updater<ConfigurationStateSizeAndSpace>;
};
