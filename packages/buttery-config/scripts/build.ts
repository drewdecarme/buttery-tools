import path from "node:path";
import { build } from "@buttery/builder";

build([path.resolve(import.meta.dirname, "../src/index.ts")]);
