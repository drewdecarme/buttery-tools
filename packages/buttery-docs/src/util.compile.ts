import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { LOG } from "./util.logger";
import { parsePageSectionAndOrderFromFilename } from "./util.parsePageSectionAndOrderFromFilename";

export type CompileArgs = {
  docsDir: string;
};

export const compile = async (args: CompileArgs) => {
  try {
    const files = await readdir(args.docsDir);

    console.log(files);

    for (const fileIndex in files) {
      const fileName = files[fileIndex];
      const filePath = path.resolve(args.docsDir, "./".concat(fileName));
      const fileContent = await readFile(filePath, { encoding: "utf8" });

      try {
        const [section, order] = parsePageSectionAndOrderFromFilename(fileName);

        console.log({ fileName, section, order });
      } catch (error) {
        LOG.warning(error as string);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
