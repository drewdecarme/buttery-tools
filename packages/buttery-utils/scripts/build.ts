import path from "node:path";
import { build } from "@buttery/builder";

const entryPoints = ["browser", "isomorphic", "node"].map((lib) =>
  path.resolve(import.meta.dirname, `../src/${lib}/index.ts`)
);

build(entryPoints);
