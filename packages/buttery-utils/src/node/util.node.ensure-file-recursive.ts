import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Ensures that a file exists. If the file does not exist, it is created.
 * If the directory structure does not exist, it is also created.
 */
export async function ensureFileRecursive(filePath: string) {
  try {
    // Check if the file already exists
    await access(filePath);
  } catch {
    // If file does not exist, create the directory and the file
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, "", { flag: "a" }); // Create the file if it doesn't exist
  }
}
