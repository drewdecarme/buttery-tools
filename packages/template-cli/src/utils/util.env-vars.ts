import dotenv from "dotenv";

import { resolve } from "path";

import { getDirname } from "./util.dirname.js";

const __dirname = getDirname(import.meta.url);

dotenv.config({ path: resolve(__dirname, "../../.env") });
