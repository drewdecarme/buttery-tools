import path from "node:path";

export default {
  name: "tokens",
  description: "A CLI to develop and build buttery tokens",
  version: "0.0.1",
  root: path.resolve(import.meta.dirname),
  tokens: {},
};
