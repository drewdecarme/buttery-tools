import { LOG_DOCS } from "./util.logger";

export const removeFileExtension = (filepath: string) => {
  const matchRegex = /\\.(.*?)\.(md|mdx|ts)$/;
  const filename = filepath.match(matchRegex);
  if (!filename) {
    throw LOG_DOCS.fatal(
      new Error(`Cannot remove file extension of "${filepath}"`)
    );
  }
  return filename[1];
};
