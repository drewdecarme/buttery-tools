import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type internal from "node:stream";

/**
 * Writes a file regardless of a directory doesn't exist.
 */
export async function writeDirAndFile(
  filepath: string,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | internal.Stream
) {
  try {
    const directory = path.dirname(filepath);

    // Ensure the directory exists
    await mkdir(directory, { recursive: true });

    // Write the file
    await writeFile(filepath, data, { encoding: "utf-8" });
  } catch (error) {
    throw new Error(String(error));
  }
}
