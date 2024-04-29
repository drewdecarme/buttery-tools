import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  name: "buttery-tokens",
  description: "A CLI to develop and build buttery tokens",
  version: "0.0.1",
  root: path.resolve(__dirname),
};
