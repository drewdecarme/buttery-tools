import path from "node:path";

import jsonSchema from "@buttery/tokens-utils/schema.json" assert { type: "json" };
import { tryHandle } from "@buttery/utils/isomorphic";
import { writeFileRecursive } from "@buttery/utils/node";

import { LOG } from "../src/utils/util.logger.js";

const jsonSchemaOutPath = path.resolve(
  import.meta.dirname,
  "../dist/schema.json"
);
const jsonSchemaString = JSON.stringify(jsonSchema, null, 2);

async function copySchemaJsonFromUtils() {
  const res = await tryHandle(writeFileRecursive)(
    jsonSchemaOutPath,
    jsonSchemaString
  );
  if (res.hasError) {
    throw LOG.fatal(res.error);
  }

  LOG.success("Successfully copied schema.json from utils into tokens");
}

copySchemaJsonFromUtils();
