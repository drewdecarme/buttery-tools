import { buildLibrary } from "../src/scripts/script.build-lib";
import { tokenLogger } from "../src/utils";

type BuildArgs = {
  watch: boolean;
};

/**
 * A simple function that parses the `process.argv` to find
 * some default values that were expecting in order to develop
 * the cli builder properly. We don't really need anything too
 * complex here... all we're looking to do is allow some args
 * to be supplied to the build script internally to this package.
 */
export const getArgs = (): BuildArgs => {
  const args = process.argv.slice(2);

  return args.reduce<BuildArgs>(
    (accum, arg) => {
      if (arg === "--watch" || arg === "-w") {
        return Object.assign({}, accum, { watch: true });
      }
      return accum;
    },
    { watch: false }
  );
};

try {
  const { watch } = getArgs();
  // run both in parallel
  await Promise.all([buildLibrary({ watch })]);
} catch (error) {
  console.log(error);
  throw tokenLogger.fatal(new Error(error));
}
