import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ButteryConfigTokens } from "@buttery/core";
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

const filenameDelimiter = "__";
const encodeTitle = (title: string) => title.replace(/\s+/g, "-");
const decodeTitle = (title: string) => title.replace(/-/g, " ");
const parseConfigFilename = (filename: string) => {
  const filenameWithoutExt = filename.split(".json")[0];
  const segments = filenameWithoutExt.split(filenameDelimiter);

  const timestampRaw = segments[0];
  const timestamp = new Date(Number(timestampRaw)).toISOString();

  const titleRaw = segments[1];
  const title = decodeTitle(titleRaw);
  return {
    title,
    timestamp,
  };
};

type ConfigAndProperties = {
  filename: string;
  title: string;
  date: string | null;
  isOriginal: boolean;
};

export type GetConfigApiResponse = ConfigAndProperties;
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

export type GetConfigHistoryApiResponse = ConfigAndProperties[];
configRouter.route("/history").get(async (_request, response, next) => {
  try {
    const files = await readdir(configDir);
    const parsedFiles = files.reduce<ConfigAndProperties[]>((accum, file) => {
      try {
        const { timestamp, title } = parseConfigFilename(file);
        return accum.concat({
          filename: file,
          title: title,
          date: timestamp,
          isOriginal: false,
        });
      } catch (error) {
        return [
          {
            filename: file,
            title: "Original",
            date: null,
            isOriginal: true,
          },
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...accum,
        ];
      }
    }, []);
    return response.json(parsedFiles);
  } catch (error) {
    next(error);
  }
});

export type PostConfigApiResponse = ConfigAndProperties;
export type PostConfigApiRequest = {
  title: string;
  config: ButteryConfigTokens;
};
configRouter.route("/").post(async (request, response, next) => {
  try {
    const timestamp = new Date().getTime();
    const title = encodeTitle(request.body.title);
    const configPath = path.resolve(
      configDir,
      `./${timestamp}${filenameDelimiter}${title}.json`
    );
    const writeSaveFile = writeFile(
      saveFile,
      `import type { ButteryConfigTokens } from "@buttery/core";
export const tokens: ButteryConfigTokens = ${JSON.stringify(
        request.body.config,
        null,
        2
      )};
`
    );

    const writeHistoryFile = writeFile(
      configPath,
      JSON.stringify(request.body.config, null, 2)
    );
    await Promise.all([writeHistoryFile, writeSaveFile]);
    const resPayload: PostConfigApiResponse = {
      date: new Date(timestamp).toISOString(),
      title: decodeTitle(title),
      isOriginal: false,
      filename: configPath,
    };
    return response.json(resPayload);
  } catch (error) {
    next(error);
  }
});

apiRouter.use("/config", configRouter);
app.use("/api", apiRouter);

// Centralized error handling middleware
app.use((err: Error, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
