import path from "node:path";
import { readFile } from "node:fs/promises";

import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";
import { ConfigSchema } from "@buttery/tokens-utils/schemas";
import { tryHandleSync } from "@buttery/utils/isomorphic";

import { errors } from "./util.error-modes";
import { LOG } from "./util.logger";

export function getLocalConfigVars() {
  LOG.debug("Fetching local configuration variables");
  const vars = {
    CONFIG_PATH: String(process.env.BUTTERY_TOKENS_PG_CONFIG_PATH),
    VERSION_DIR: String(process.env.BUTTERY_TOKENS_PG_VERSION_DIR),
  };

  return Object.entries(vars).reduce((accum, [varName, varValue]) => {
    if (typeof varValue === "undefined") {
      throw errors.MISSING_ENV_VAR(
        "The application is being run in LOCAL mode but was unable to reconcile some environment variables. This should not have happened. Please raise a GitHub issue.",
        varName
      );
    }
    return Object.assign(accum, { [varName]: varValue });
  }, {}) as typeof vars;
}

export function getIsLocalConfig() {
  const isLocal = process.env.BUTTERY_TOKENS_PG_IS_LOCAL;
  return isLocal === "true";
}

async function getLocalConfig() {
  const configPathFromProcess = process.env.BUTTERY_TOKENS_PG_CONFIG_PATH;
  if (!configPathFromProcess) {
    throw errors.MISSING_ENV_VAR(
      "Unable to determine local path of `buttery-tokens.config.json`",
      "BUTTERY_TOKENS_PG_CONFIG_PATH"
    );
  }
  const configPath = path.resolve(configPathFromProcess);
  const rawConfig = await readFile(configPath, { encoding: "utf8" });

  const jsonConfig = tryHandleSync<Record<string, unknown>, [string]>(
    JSON.parse
  )(rawConfig);
  if (jsonConfig.hasError) {
    throw errors.WITH_MESSAGE(
      "Error when trying to convert the local configuration into well formed JSON",
      jsonConfig.error
    );
  }
  const parsedConfig = ConfigSchema.safeParse(jsonConfig.data);
  if (parsedConfig.error) {
    throw errors.WITH_MESSAGE(
      "Error when trying to parse the local config against the schema",
      parsedConfig.error
    );
  }
  return parsedConfig.data;
}

export async function getButteryConfig(): Promise<ButteryTokensConfig> {
  LOG.debug("Fetching configuration");
  if (getIsLocalConfig()) {
    LOG.debug("Running in LOCAL mode. Fetching local configuration.");
    const config = await getLocalConfig();
    return config;
  }

  // TODO: Fetch the configuration from the API
  const config = ConfigSchema.safeParse({});
  if (config.error) {
    throw errors.WITH_MESSAGE(
      "Error when trying to parse the local config against the schema",
      config.error
    );
  }

  return config.data;
}
