import { readFile } from "node:fs/promises";
import { parseAndValidateOptions } from "@buttery/core/utils/node";
import { select } from "@inquirer/prompts";
import { getButteryDocsConfig } from "../getButteryDocsConfig";
import { getButteryDocsDirectories } from "../getButteryDocsDirectories";
import {
  type ButteryDocsAddOptions,
  butteryDocsAddOptionsSchema,
} from "../options";
import { LOG } from "../utils";

// TODO: Cleanup and add path
export async function add(
  path: string,
  options?: Partial<ButteryDocsAddOptions>
) {
  const parsedOptions = parseAndValidateOptions(
    butteryDocsAddOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  const config = await getButteryDocsConfig({
    prompt: parsedOptions.prompt,
  });
  const dirs = await getButteryDocsDirectories(config);

  //
  if (parsedOptions.template) {
    LOG.debug("--template=true. Reading template manifest and prompting user");
    const templateManifest = await readFile(dirs.templates.manifest, "utf8");
    const templateManifestJson = JSON.parse(templateManifest);
    const templateContentTypes = Object.keys(templateManifestJson);

    const selectedTemplateContentType = await select<string>({
      message: "Please select a template to bootstrap doc",
      choices: templateContentTypes,
    });

    const templateEntry = templateManifestJson[selectedTemplateContentType];
    const templateContent = Buffer.from(templateEntry, "base64").toString(
      "utf-8"
    );

    console.log(templateContent);
  }
}
