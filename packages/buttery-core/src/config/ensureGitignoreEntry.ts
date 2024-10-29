import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import { ensureFile } from "fs-extra";
import { LOG } from "../private";

/**
 * Adds an entry to the .gitignore file in the .buttery directory if
 * it doesn't already exist. If the .gitignore file doesn't exist, this
 * function will create it.
 *
 * This is helpful if throughout the config resolution and transpilation process
 * a file needs to be created to be read but we don't want to rely on the user
 * to manually add entires to their own .gitignore file.
 */
export async function ensureGitIgnoreEntry(
  entry: string,
  options: { butteryDir: string }
) {
  const resolvedGitIgnoreFile = path.resolve(
    options.butteryDir,
    "./.gitignore"
  );

  try {
    LOG.debug("Ensuring .buttery/.gitignore file exists...");
    await ensureFile(resolvedGitIgnoreFile);
    LOG.debug("Ensuring .buttery/.gitignore file exists... done");
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to ensure the existence of the \`.buttery/.gitignore\` file: ${error}`
      )
    );
  }

  try {
    LOG.debug("Checking .buttery/.gitignore for entry", { entry });
    const gitIgnoreContents = await readFile(resolvedGitIgnoreFile, {
      encoding: "utf8",
    });
    if (gitIgnoreContents.includes(entry)) {
      LOG.debug("Entry already exists in ./buttery/.gitignore... moving on.");
      return;
    }
    const newEntry = `\n${entry}\n`;
    // appends the entry on a new line of the .gitignore
    LOG.debug(
      "Entry does not exist in ./buttery/.gitignore. Appending file..."
    );
    await appendFile(resolvedGitIgnoreFile, newEntry, { encoding: "utf8" });
    LOG.debug(
      "Entry does not exist in ./buttery/.gitignore. Appending file..."
    );
    return;
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to read and append the \`.buttery/.gitignorae\` file: ${error}`
      )
    );
  }
}
