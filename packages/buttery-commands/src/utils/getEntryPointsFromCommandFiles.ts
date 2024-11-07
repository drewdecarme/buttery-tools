import type { CommandFile } from "./utils";

export function getEntryPoints(cmdFiles: CommandFile[]) {
  return cmdFiles.map((cmd) => ({
    in: cmd.inPath,
    out: cmd.outPath,
  }));
}
