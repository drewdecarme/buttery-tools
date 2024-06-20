import { randomUUID } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Evaluates the transpiled JavaScript code in a sandboxed environment
 */
export async function butteryConfigEvaluateFile(code: string) {
  // Write the transpiled JavaScript code to a temporary file
  const tempFilePath = path.resolve(import.meta.dirname, `${randomUUID()}.js`);
  await writeFile(tempFilePath, code);

  // Dynamically import the temporary JavaScript file as an ES module
  const moduleURL = pathToFileURL(tempFilePath).href;
  const module = await import(moduleURL);

  // Clean up the temporary file
  await unlink(tempFilePath);

  return module.default;
}
