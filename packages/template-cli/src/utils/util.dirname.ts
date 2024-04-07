import { dirname } from "path";
import { fileURLToPath } from "url";

export const getDirname = (url: ImportMeta["url"]) =>
  dirname(fileURLToPath(url));
