export type DevelopmentArgs = {
  watch: boolean;
};

const defaultDevelopmentArgs: DevelopmentArgs = {
  watch: false,
};

export const processBuildArgs = (
  args: typeof process.argv
): DevelopmentArgs => {
  return args.reduce<DevelopmentArgs>((accum, arg) => {
    if (arg === "--watch" || arg === "-w") {
      return { ...accum, watch: true };
    }
    return accum;
  }, defaultDevelopmentArgs);
};
