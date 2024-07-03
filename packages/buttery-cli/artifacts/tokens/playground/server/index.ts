import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import bodyParser from "body-parser";
import express, { type Request, type Response } from "express";

// constants
const port = process.env.PLAYGROUND_SERVER_PORT;
const saveFile = process.env.PLAYGROUND_SERVER_CONFIG_SAVE_FILE_PATH as string;
const configDir = process.env.PLAYGROUND_SERVER_CONFIG_DIRECTORY as string;

// New app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const apiRouter = express.Router();
const configRouter = express.Router();

configRouter.route("/").get(async (_request, response, next) => {
  try {
    const configPath = path.resolve(configDir, "./config.json");
    const configFile = await readFile(configPath, "utf8");
    const configJson = JSON.parse(configFile);
    return response.json(configJson);
  } catch (error) {
    next(error);
  }
});

configRouter.route("/").post(async (request, response, next) => {
  try {
    const timestamp = new Date().getTime();
    const configPath = path.resolve(configDir, `./config-${timestamp}.json`);
    const writeSaveFile = writeFile(
      saveFile,
      `import type { ButteryConfigTokens } from "@buttery/core";
export const tokens: ButteryConfigTokens = ${JSON.stringify(
        request.body,
        null,
        2
      )};
`
    );
    const writeHistoryFile = writeFile(
      configPath,
      JSON.stringify(request.body, null, 2)
    );
    await Promise.all([writeHistoryFile, writeSaveFile]);
    return response.json(request.body);
  } catch (error) {
    next(error);
  }
});

apiRouter.use("/config", configRouter);
app.use("/api", apiRouter);

// Centralized error handling middleware
app.use((err: any, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
