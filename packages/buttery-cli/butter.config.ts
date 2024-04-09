import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  name: "butter",
  description:
    "The buttery ecosystem CLI. Bootstrapped and dog-fooded using buttery itself. Let's spread it on!",
  version: "0.0.1",
  root: path.resolve(__dirname),
};
