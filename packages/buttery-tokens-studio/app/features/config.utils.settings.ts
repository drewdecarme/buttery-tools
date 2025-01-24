import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

export type ConfigurationStateSettings = ButteryTokensConfig["runtime"];

function getInitSettingsStateFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateSettings {
  return config.runtime;
}

export function useConfigStateSettings(initConfig: ButteryTokensConfig) {
  return useImmer(getInitSettingsStateFromConfig(initConfig));
}
export type ConfigurationContextSettingsType = {
  settings: ConfigurationStateSettings;
  setSettings: Updater<ConfigurationStateSettings>;
};

export function getSettingsConfigFromState(
  state: ConfigurationStateSettings
): ButteryTokensConfig["runtime"] {
  return state;
}
