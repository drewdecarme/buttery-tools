import { build } from "../src/build.js";
import { parseBuildArgs } from "../src/util.parse-build-args.js";

try {
  const args = process.argv.slice(2);
  const parsedArgs = parseBuildArgs(args);
  await build(parsedArgs);
} catch (error) {
  console.error(error);
}
