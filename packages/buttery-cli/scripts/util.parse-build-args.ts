export type BuildArgs = {
  watch: boolean;
};

const defaultBuildArgs: BuildArgs = {
  watch: false,
};

/**
 * A simple function that parses the `process.argv` to find
 * some default values that were expecting in order to develop
 * the cli builder properly. We don't really need anything too
 * complex here... all we're looking to do is allow some args
 * to be supplied to the build script internally to this package.
 */
export const parseBuildArgs = (args: typeof process.argv): BuildArgs => {
  return args.reduce<BuildArgs>((accum, arg) => {
    if (arg === "--watch" || arg === "-w") {
      return { ...accum, watch: true };
    }
    return accum;
  }, defaultBuildArgs);
};
