import path from "node:path";

import { zodToJsonSchema } from "zod-to-json-schema";
import { tryHandle } from "@buttery/utils/isomorphic";
import { writeFileRecursive } from "@buttery/utils/node";
import { ButteryLogger } from "@buttery/logs";
import { z } from "zod";

import { ConfigSchema } from "../lib/schemas/schema.js";

const LOG = new ButteryLogger({
  id: "buttery-tokens-utils",
  prefix: "buttery:tokens-utils",
  prefixBgColor: "#ccc",
});

async function createJsonSchema() {
  LOG.debug("Converting the Config schema into a JSON schema");
  const jsonSchema = zodToJsonSchema(
    ConfigSchema.merge(
      z.object({
        // add a schema field onto the output JSON schema so we
        // can correctly reference the file
        $schema: z.string().default("https://buttery.tools/tokens/schema.json"),
      })
    ),
    {
      name: "buttery-tokens",
      nameStrategy: "ref",
      target: "jsonSchema7",
    }
  );
  LOG.debug("Converting the Config schema into a JSON schema... done.");

  LOG.debug("Writing to file");
  const res = await tryHandle(writeFileRecursive)(
    path.resolve(import.meta.dirname, "../schema.json"),
    JSON.stringify(jsonSchema, null, 2)
  );
  if (res.hasError) {
    throw LOG.fatal(res.error);
  }
  LOG.success("Successfully create JSON schema from the ButteryConfig");
}

createJsonSchema();
