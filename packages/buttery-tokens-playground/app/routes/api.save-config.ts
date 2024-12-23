import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { writeFileRecursive } from "@buttery/utils/node";
import { tryHandle } from "@buttery/utils/isomorphic";
import { data, type ActionFunctionArgs } from "react-router";

import { wrapConfig } from "~/utils/util.config-template";
import { getIsLocalConfig } from "~/utils/util.getLocalConfig";
import { LOG } from "~/utils/util.logger";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const isLocalConfig = getIsLocalConfig();

  const config = String(formData.get("config"));

  if (!isLocalConfig) {
    return { config: null };
  }

  const configFilePath = String(process.env.BUTTERY_TOKENS_PG_CONFIG_PATH);
  const storePath = String(process.env.BUTTERY_TOKENS_PG_VERSION_DIR);

  console.log({ storePath, configFilePath });

  if (!configFilePath) {
    return {
      status: 400,
      message:
        "The application is being run in LOCAL mode but was unable to detect the path to save the config to.",
    };
  }

  // read the existing configuration and write it into a new version file
  LOG.debug("Reading existing configuration to create new version");
  const originalConfig = await tryHandle(readFile)(configFilePath);
  if (originalConfig.hasError) {
    LOG.fatal(originalConfig.error);
    return {
      status: 500,
      message: "Unable to create a new version of the buttery-tokens.config.ts",
    };
  }
  const newVersionTimestamp = String(new Date().getTime());
  const newVersionPath = path.join(
    storePath,
    `buttery-tokens.config.${newVersionTimestamp}.ts`
  );
  LOG.debug("Creating a new version of the configuration");
  const newVersion = await tryHandle(writeFileRecursive)(
    newVersionPath,
    originalConfig.data
  );
  if (newVersion.hasError) {
    LOG.fatal(newVersion.error);
    return {
      status: 500,
      message: "Unable to create a new version of the buttery-tokens.config.ts",
    };
  }

  // Save the new configuration
  const parsedConfig = JSON.parse(config);
  const res = await tryHandle(writeFile)(
    configFilePath,
    wrapConfig(parsedConfig)
  );
  if (res.hasError) {
    LOG.fatal(res.error);
    return data({
      status: 500,
      message: res.error.message,
    });
  }
  return { config: parsedConfig };
}
