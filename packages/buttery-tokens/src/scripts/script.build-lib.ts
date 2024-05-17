import path from "node:path";
import { buildTSLibrary } from "@buttery/utils/esbuild";
import { tokenLogger } from "../utils";

/**
 * Builds the `src/lib` directory so types can be imported and used
 * when someone is configuring their repo / project with buttery tokens.
 * Types like `TokensConfig` are defined and exported from there.
 */
export const buildLibrary = async (options: { watch?: boolean }) => {
  try {
    tokenLogger.debug("Building buttery tokens distribution directory...");
    await buildTSLibrary({
      srcDir: path.resolve(import.meta.dirname, "../lib"),
      outDir: path.resolve(import.meta.dirname, "../../dist"),
      tsconfigPath: path.resolve(
        import.meta.dirname,
        "../../tsconfig.lib.json"
      ),
      logger: tokenLogger,
      watch: options.watch ?? false
    });
    tokenLogger.success(
      "Building buttery tokens distribution directory... success"
    );
  } catch (error) {
    const err = new Error(error);
    tokenLogger.fatal(err);
    throw err;
  }
};
