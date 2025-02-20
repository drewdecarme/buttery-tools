import type {
  ButteryTokensConfig,
  CustomVariantNumber,
  CustomVariantRem,
  CustomVariantString,
} from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

export type ConfigurationStateCustomValueRem = {
  name: string;
} & CustomVariantRem;
export type ConfigurationStateCustomValueNumber = {
  name: string;
} & CustomVariantNumber;
export type ConfigurationStateCustomValueString = {
  name: string;
} & CustomVariantString;
export type ConfigurationStateCustomValue =
  | ConfigurationStateCustomValueRem
  | ConfigurationStateCustomValueNumber
  | ConfigurationStateCustomValueString;

export type ConfigurationStateCustom = {
  [key: string]: ConfigurationStateCustomValue;
};

function getInitCustomStateFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateCustom {
  return Object.entries(config.custom).reduce<ConfigurationStateCustom>(
    (accum, [name, value]) =>
      Object.assign<ConfigurationStateCustom, ConfigurationStateCustom>(accum, {
        [generateGUID()]: {
          name,
          ...value,
        },
      }),
    {}
  );
}

export type OnCustomAction = (
  options:
    | {
        action: "addToken";
      }
    | { action: "deleteToken"; id: string }
    | { action: "updateName"; id: string; name: string }
    | { action: "updateDescription"; id: string; description: string }
    | {
        action: "updateType";
        id: string;
        type: ConfigurationStateCustomValue["type"];
      }
    | {
        action: "updateValue";
        id: string;
        value: ConfigurationStateCustomValue["value"];
      }
) => void;

export function useConfigStateCustom(initConfig: ButteryTokensConfig) {
  return useImmer(getInitCustomStateFromConfig(initConfig));
}

export type ConfigurationContextCustomType = {
  custom: ConfigurationStateCustom;
  setCustom: Updater<ConfigurationStateCustom>;
};

export function getCustomConfigFromState(
  state: ConfigurationStateCustom
): ButteryTokensConfig["custom"] {
  return Object.values(state).reduce(
    (accum, { name, ...restDef }) =>
      Object.assign<
        ButteryTokensConfig["custom"],
        ButteryTokensConfig["custom"]
      >(accum, {
        [name]: restDef,
      }),
    {}
  );
}
