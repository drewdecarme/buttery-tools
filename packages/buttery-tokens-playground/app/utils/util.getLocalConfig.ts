import { ConfigSchema } from "@buttery/tokens-utils/schemas";
import { tryHandleSync } from "@buttery/utils/isomorphic";

import { LOG } from "./util.logger";

export function getLocalConfig() {
  const rawConfig = process.env.BUTTERY_TOKENS_PG_LOCAL_CONFIG;
  return rawConfig;
}

export function getIsLocalConfig() {
  const rawConfig = process.env.BUTTERY_TOKENS_PG_LOCAL_CONFIG;
  if (typeof rawConfig === "undefined") {
    return false;
  }

  const jsonConfig = tryHandleSync(JSON.parse)(rawConfig);
  if (jsonConfig.hasError) {
    throw LOG.fatal(
      new Error(
        `Error when trying to convert the local configuration into well formed JSON: ${jsonConfig.error.message}`
      )
    );
  }

  const parsedConfig = ConfigSchema.safeParse(jsonConfig.data);
  if (parsedConfig.error) {
    throw LOG.fatal(
      new Error(
        `Error when trying to parse the local config against the schema: ${parsedConfig.error.message}`
      )
    );
  }

  return {
    config: parsedConfig.data,
  };
}
