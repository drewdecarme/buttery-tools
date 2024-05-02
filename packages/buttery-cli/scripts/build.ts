import { build } from "../src/script.build.js";
import { parseBuildArgs } from "./util.parse-build-args.js";

try {
  const args = process.argv.slice(2);
  const parsedArgs = parseBuildArgs(args);
  await build(parsedArgs);
} catch (error) {
  console.error(error);
}
