import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const hashString = (input: string) => {
  return createHash("sha256").update(input).digest("hex");
};

/**
 * Evaluates the transpiled JavaScript code in a sandboxed environment
 */
export async function butteryConfigEvaluateFile(code: string) {
  // Write the transpiled JavaScript code to a temporary file
  const tempFileName = hashString(code);
  const tempDirPath = path.resolve(import.meta.dirname, "./temp");
  const tempFilePath = path.resolve(tempDirPath, `./${tempFileName}.js`);

  // try to get what was already created
  try {
    const module = await import(`./temp/${tempFileName}.js`); // done this way for static vite dynamic importing
    return module.default;
  } catch (error) {
    // if it wasn't created, it's creating a new reference
    await mkdir(tempDirPath, { recursive: true });
    await writeFile(tempFilePath, code);

    // Dynamically import the temporary JavaScript file as an ES module
    const module = await import(`./temp/${tempFileName}.js`); // done this way for static vite dynamic importing
    return module.default;
  }
}
