import { writeFile } from "node:fs/promises";
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

  const originalConfig = String(process.env.BUTTERY_TOKENS_PG_LOCAL_CONFIG);
  const configFilePath = String(process.env.BUTTERY_TOKENS_PG_CONFIG_PATH);
  const storePath = String(process.env.BUTTERY_TOKENS_PG_VERSION_DIR);

  if (!configFilePath) {
    return {
      status: 400,
      message:
        "The application is being run in LOCAL mode but was unable to reconcile some environment variables. This should not have happened. Please raise a GitHub issue.",
    };
  }

  // Take the existing configuration and write it to a versioned file
  const newVersionTimestamp = String(new Date().getTime());
  const newVersionPath = path.join(
    storePath,
    `buttery-tokens.config.${newVersionTimestamp}.json`
  );
  LOG.debug("Creating a new version of the configuration");
  const newVersion = await tryHandle(writeFileRecursive)(
    newVersionPath,
    JSON.stringify(
      {
        meta: {
          savedOn: new Date().toISOString(),
        },
        config: JSON.parse(originalConfig),
      },
      null,
      2
    )
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
