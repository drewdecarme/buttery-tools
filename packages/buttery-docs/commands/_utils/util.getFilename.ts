import { LOG_DOCS } from "./util.logger";

export const getFilename = (filepath: string) => {
  const matchRegex = /\\.(.*?)\.(md|mdx|ts)$/;
  const filename = filepath.match(matchRegex);
  if (!filename) {
    throw LOG_DOCS.fatal(new Error(`Cannot get filename of "${filepath}"`));
  }
  return filename[1];
};
