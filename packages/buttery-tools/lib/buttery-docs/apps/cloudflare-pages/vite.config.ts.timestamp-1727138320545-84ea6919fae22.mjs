// .buttery/commands/docs/docs.getButteryDocsViteConfig.ts
import path13 from "node:path";
import mdx from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@mdx-js/rollup/index.js";
import { vitePlugin as remix } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@remix-run/dev/dist/index.js";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@remix-run/dev/dist/index.js";
import rehypeShiki from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@shikijs/rehype/dist/index.mjs";
import wyw from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@wyw-in-js/vite/esm/index.mjs";
import rehypeAutolinkHeadings from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-autolink-headings/index.js";
import rehypeSlug2 from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-slug/index.js";
import remarkFrontmatter from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-frontmatter/index.js";
import remarkMdxFrontmatter from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-mdx-frontmatter/dist/remark-mdx-frontmatter.js";
import { mergeConfig } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/vite/dist/node/index.js";

// .buttery/commands/docs/docs.getButteryDocFiles.ts
import { readdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path3 from "node:path";

// utils/ts/util.ts.exhaustive-match-guard.ts
var exhaustiveMatchGuard = (_) => {
  throw new Error(`Forgot to include an "${_}" in the switch statement`);
};

// lib/buttery-logger/ButteryLogger.ts
import chalk from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/chalk/source/index.js";
var ButteryLogger = class {
  logLevel;
  logLevelValue;
  logLevelColor;
  //   private format: ButteryLoggerOptionFormat;
  prefix;
  logLevelStringMaxLength;
  shouldPrintLevel;
  constructor(options) {
    this.prefix = options.prefix;
    this.logLevel = options.logLevel ?? "info";
    this.logLevelValue = {
      info: 5,
      timer: 4,
      debug: 3,
      warn: 2,
      error: 1
    };
    this.logLevelColor = {
      info: chalk.bold.blue,
      timer: chalk.bold.yellowBright,
      debug: chalk.bold.magenta,
      warn: chalk.bold.yellow,
      error: chalk.bold.red
    };
    this.shouldPrintLevel = options.shouldPrintLevel ?? false;
    this.logLevelStringMaxLength = Object.keys(this.logLevelColor).reduce(
      (accum, logLevel) => logLevel.length > accum ? logLevel.length : accum,
      0
    );
  }
  /**
   * Allows to publicly set the logLevel
   * to display the appropriate logs at
   * the appropriate times
   * TODO: This still isn't working
   */
  set level(level) {
    this.logLevel = level;
  }
  printLevel(level) {
    if (!this.shouldPrintLevel) return void 0;
    const color = this.logLevelColor[level];
    const levelString = `[${level.toUpperCase()}]`;
    const paddedLevelString = levelString.padEnd(
      this.logLevelStringMaxLength + 2,
      " "
    );
    return color(paddedLevelString);
  }
  printTimestamp() {
    const now = /* @__PURE__ */ new Date();
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
      timeStyle: "medium"
    });
    const timestampString = chalk.gray(`[${dateTimeFormat.format(now)}]`);
    return timestampString;
  }
  printPrefix() {
    return chalk.bgBlack(`[${this.prefix}]`);
  }
  shouldLog(level) {
    const classNumericLevel = this.logLevelValue[this.logLevel];
    const suppliedNumericLevel = this.logLevelValue[level];
    return classNumericLevel >= suppliedNumericLevel;
  }
  log({
    level,
    message,
    method
  }, ...extraSerializableData) {
    if (!this.shouldLog(level)) return;
    const messageString = chalk.gray(message);
    const logMessage = [
      this.printTimestamp(),
      this.printLevel(level),
      this.printPrefix(),
      method,
      messageString
    ].filter((val) => typeof val !== "undefined").join(" ");
    if (level === "error") {
      return console.error(logMessage);
    }
    if (extraSerializableData.length === 0) {
      return console.log(logMessage);
    }
    console.log(
      logMessage,
      ...extraSerializableData.map((data) => this.formatLogData(data))
    );
  }
  formatLogData(data) {
    if (!data) return "";
    return JSON.stringify(data);
  }
  debug(message, ...data) {
    const method = chalk.blue(`\u25CF ${chalk.underline("debug")}`);
    this.log({ level: "info", method, message }, ...data);
  }
  success(message, ...data) {
    const method = chalk.green(`\u2713 ${chalk.underline("success")}`);
    this.log({ level: "info", method, message }, ...data);
  }
  warning(message, ...data) {
    const method = chalk.yellowBright(`! ${chalk.underline("warning")}`);
    this.log({ level: "warn", method, message }, ...data);
  }
  error(message, ...data) {
    const method = chalk.red(`\u2715 ${chalk.underline("error")}`);
    this.log({ level: "error", method, message }, ...data);
  }
  watch(message, ...data) {
    const method = chalk.hex("#FFA500")(`\u29BF ${chalk.underline("watching")}`);
    this.log({ level: "error", method, message }, ...data);
  }
  info(message, ...data) {
    const method = chalk.blueBright(`\u2139\uFE0E ${chalk.underline("info")}`);
    this.log({ level: "info", method, message }, ...data);
  }
  fatal(error) {
    const method = chalk.redBright.bold(`\u2715 ${chalk.underline("fatal")}`);
    this.log({ level: "error", method, message: error.message });
    if (!this.shouldLog("error")) return;
    console.log(`
${chalk.grey(
      error.stack?.replace(
        `Error: ${error.message}
`,
        ""
      )
    )}    
    `);
  }
};

// .buttery/commands/_logger/util.ts.logger.ts
var LOG = new ButteryLogger({
  prefix: "buttery",
  logLevel: "info"
});

// .buttery/commands/docs/docs.getButteryDocsDirectories.ts
import path2 from "node:path";

// utils/node/util.node.find-directory-upwards.ts
import fs from "node:fs";
import path from "node:path";
function findDirectoryUpwards(dirName, nestedDirName, options) {
  const startingDirectory = options?.startingDirectory ?? process.cwd();
  let currentDirectory = path.resolve(startingDirectory);
  while (true) {
    const contents = fs.readdirSync(currentDirectory);
    if (contents.includes(dirName)) {
      const targetDirPath = path.join(currentDirectory, dirName);
      if (nestedDirName) {
        const nestedContents = fs.readdirSync(targetDirPath);
        if (nestedContents.includes(nestedDirName)) {
          return path.join(targetDirPath, nestedDirName);
        }
      } else {
        return targetDirPath;
      }
    }
    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      return null;
    }
    currentDirectory = parentDirectory;
  }
}

// utils/node/util.node.dynamic-import.ts
async function dynamicImport(modulePath) {
  const timestamp = (/* @__PURE__ */ new Date()).getTime();
  const importSpecifier = `${modulePath}?t=${timestamp}`;
  return await import(importSpecifier);
}

// .buttery/commands/docs/docs.getButteryDocsDirectories.ts
var __vite_injected_original_dirname = "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tools/.buttery/commands/docs";
async function getButteryDocsDirectories(config) {
  const userCreatedDocsDir = path2.resolve(config.paths.butteryDir, "./docs");
  const lib = findDirectoryUpwards("lib", void 0, {
    startingDirectory: __vite_injected_original_dirname
  });
  if (!lib) {
    throw "Cannot locate lib directory to build documentation site. This should not have happened. Please log a Github issue.";
  }
  const artifactsRootDir = path2.resolve(lib, "./buttery-docs");
  const libAppsDir = path2.resolve(artifactsRootDir, "./apps");
  const libComponentsDir = path2.resolve(artifactsRootDir, "./components");
  const libLibDir = path2.resolve(artifactsRootDir, "./lib");
  const templateName = `./${config.docs.buildTarget}`;
  const appTemplateRootDir = path2.resolve(libAppsDir, templateName);
  const outputRootDir = path2.resolve(userCreatedDocsDir, "./dist");
  const outputBundleDir = path2.resolve(outputRootDir, "./build");
  return {
    /**
     * The docs that are created and stored by the user. This is where
     * they create their markdown|mdx files to then be created into
     * the app
     */
    srcDocs: {
      root: userCreatedDocsDir,
      public: path2.resolve(userCreatedDocsDir, "./public")
    },
    artifacts: {
      root: artifactsRootDir,
      apps: {
        root: libAppsDir,
        template: {
          root: appTemplateRootDir,
          viteConfig: path2.resolve(appTemplateRootDir, "./vite.config.ts"),
          dataFile: path2.resolve(config.paths.storeDir, "./docs/data.js")
        }
      },
      components: libComponentsDir,
      lib: libLibDir
    },
    output: {
      root: outputRootDir,
      bundleDir: outputBundleDir
    }
  };
}

// .buttery/commands/docs/docs.getButteryDocFiles.ts
function getRoutePath(filename, options) {
  let basePath = "/";
  if (filename === "_index" && options?.staticBaseName) {
    return basePath.concat(options.staticBaseName);
  }
  const filenameSegments = filename.split(".");
  if (options?.staticBaseName) {
    basePath = basePath.concat(`${options.staticBaseName}/`);
  }
  return basePath.concat(filenameSegments.join("/"));
}
function readDirContents(dirents, options) {
  return dirents.reduce((accum, dirent) => {
    const isFile = dirent.isFile();
    if (!isFile) return accum;
    const fsPath = dirent.parentPath.concat("/").concat(dirent.name);
    const baseFilename = path3.parse(dirent.name).name;
    if (baseFilename === ".DS_Store") {
      return accum;
    }
    const routePath = getRoutePath(baseFilename, options);
    const filename = `${options?.staticBaseName ? `${options?.staticBaseName}.` : ""}`.concat(
      baseFilename
    );
    const routeFileName = filename === "_index" ? filename : filename.split(".").reduce((accum2, segment, index, origArr) => {
      if (index === 0) {
        return options.routePrefix.concat(segment);
      }
      if (index <= origArr.length - 1 && !origArr.includes("_index")) {
        return accum2.concat("_.".concat(segment));
      }
      return accum2.concat(".".concat(segment));
    }, "");
    return accum.concat({
      fsPath,
      filename,
      routeFileName,
      routePath
    });
  }, []);
}
async function getButteryDocsFiles(config) {
  const docsDirectories = await getButteryDocsDirectories(config);
  const docsDirContents = await readdir(docsDirectories.srcDocs.root, {
    recursive: false,
    withFileTypes: true
  });
  LOG.info(`Detected routeStrategy: ${config.docs.routeStrategy}`);
  const routeStrategy = config.docs.routeStrategy ?? "section-folders";
  const routePrefix = "_docs.";
  switch (routeStrategy) {
    case "flat":
      return readDirContents(docsDirContents, { routePrefix });
    case "section-folders": {
      const files = docsDirContents.reduce(
        (accum, dirent) => {
          if (dirent.isFile() && (dirent.name === "_index.md" || dirent.name === "_index.mdx")) {
            return accum.concat(readDirContents([dirent], { routePrefix }));
          }
          LOG.debug(`Reading "${dirent.name}". Skipping "/public" & "/dist"`);
          if (dirent.isDirectory() && dirent.name !== "public" && dirent.name !== "dist") {
            const sectionDir = path3.resolve(dirent.parentPath, dirent.name);
            const sectionDirContents = readdirSync(sectionDir, {
              recursive: true,
              withFileTypes: true
            });
            return accum.concat(
              readDirContents(sectionDirContents, {
                routePrefix,
                staticBaseName: dirent.name !== "_index" ? dirent.name : void 0
              })
            );
          }
          return accum;
        },
        []
      );
      return files;
    }
    default:
      return exhaustiveMatchGuard(routeStrategy);
  }
}

// .buttery/commands/_buttery-config/getButteryConfig.ts
import path9 from "node:path";

// .buttery/commands/_buttery-config/buttery-config.defaults.ts
var systemFont = `system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
var butteryConfigDefaultTokens = {
  namespace: "random",
  prefix: "random-tokens",
  strict: true,
  gridSystem: 4,
  suppressStrictWarnings: false,
  font: {
    size: 16,
    family: {
      heading: systemFont,
      body: systemFont
    },
    weight: {
      bold: 700,
      "semi-bold": 600,
      medium: 500,
      regular: 400,
      light: 300
    },
    typography: {
      heading1: {
        fontFamily: "heading",
        fontSize: 74,
        lineHeight: 82
      },
      heading2: {
        fontFamily: "heading",
        fontSize: 64,
        lineHeight: 74
      }
    }
  },
  color: {
    brand: {
      mode: "category",
      tone: "fluorescent",
      brightness: 95,
      saturation: 84,
      hues: {
        primary: 32,
        secondary: 84
      },
      variants: {
        mode: "auto",
        numOfVariants: 10
      }
    },
    shade: {
      values: {
        neutral: "#000000"
      },
      variants: {
        mode: "auto",
        numOfVariants: 10
      }
    }
  },
  breakpoints: {
    phone: 375,
    tablet: 768,
    desktop: 1280
  }
};
var butteryConfigDefaultDocs = {
  buildTarget: "cloudflare-pages",
  routeStrategy: "section-folders"
};
var butteryConfigDefaultCommands = {
  name: "random",
  description: "A CLI that needs a description - CHANGE ME",
  commandsDir: "commands",
  version: "0.0.1"
};
var butteryConfigDefaultIcons = {
  namespace: void 0,
  outDir: void 0,
  svgDir: void 0
};
var butteryConfigDefaults = {
  tokens: butteryConfigDefaultTokens,
  docs: butteryConfigDefaultDocs,
  commands: butteryConfigDefaultCommands,
  icons: butteryConfigDefaultIcons
};

// .buttery/commands/_buttery-config/ensureButteryStore.ts
import path5 from "node:path";
import { ensureDir } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/fs-extra/lib/index.js";

// .buttery/commands/_buttery-config/ensureGitignoreEntry.ts
import { appendFile, readFile } from "node:fs/promises";
import path4 from "node:path";
import { ensureFile } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/fs-extra/lib/index.js";
async function ensureGitIgnoreEntry(entry, options) {
  const resolvedGitIgnoreFile = path4.resolve(
    options.butteryDir,
    "./.gitignore"
  );
  try {
    LOG.debug("Ensuring .buttery/.gitignore file exists...");
    await ensureFile(resolvedGitIgnoreFile);
    LOG.debug("Ensuring .buttery/.gitignore file exists... done");
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to ensure the existence of the \`.buttery/.gitignore\` file: ${error}`
      )
    );
  }
  try {
    LOG.debug("Checking .buttery/.gitignore for entry", { entry });
    const gitIgnoreContents = await readFile(resolvedGitIgnoreFile, {
      encoding: "utf8"
    });
    if (gitIgnoreContents.includes(entry)) {
      LOG.debug("Entry already exists in ./buttery/.gitignore... moving on.");
      return;
    }
    const newEntry = `
${entry}
`;
    LOG.debug(
      "Entry does not exist in ./buttery/.gitignore. Appending file..."
    );
    await appendFile(resolvedGitIgnoreFile, newEntry, { encoding: "utf8" });
    LOG.debug(
      "Entry does not exist in ./buttery/.gitignore. Appending file..."
    );
    return;
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to read and append the \`.buttery/.gitignorae\` file: ${error}`
      )
    );
  }
}

// .buttery/commands/_buttery-config/ensureButteryStore.ts
async function ensureButteryStore(options) {
  const butteryStoreDir = path5.resolve(options.butteryDir, "./.store");
  await ensureGitIgnoreEntry(".store", { butteryDir: options.butteryDir });
  try {
    await ensureDir(butteryStoreDir);
    return butteryStoreDir;
  } catch (error) {
    throw LOG.fatal(
      new Error(`Fatal error when resolving the .buttery/.store: ${error}`)
    );
  }
}

// .buttery/commands/_buttery-config/getButteryConfigFile.ts
import { existsSync, lstatSync } from "node:fs";
import { readFile as readFile2 } from "node:fs/promises";
import path7 from "node:path";

// .buttery/commands/_buttery-config/buttery-config.utils.ts
import { mkdir, writeFile } from "node:fs/promises";
import path6 from "node:path";
import { checkbox, input } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/@inquirer/prompts/dist/esm/index.mjs";
async function promptUserForButteryConfigDefaults({
  message,
  defaultChecked
}) {
  return await checkbox({
    message,
    choices: Object.keys(butteryConfigDefaults).map((key) => ({
      value: key,
      checked: key === defaultChecked
    }))
  });
}
async function promptUserForButteryDirLocation(startingDirectory) {
  const baseDir = await input({
    message: "In what directory would you like to create one?",
    default: startingDirectory
  });
  const butteryDir = path6.resolve(baseDir, "./.buttery");
  return butteryDir;
}
async function createDefaultButteryConfigAndDirs(butteryDir, configs) {
  try {
    await mkdir(butteryDir, { recursive: true });
    const createButteryDirs = configs.reduce(
      (accum, configKey) => {
        const dirPath = path6.resolve(butteryDir, `./${configKey}`);
        switch (configKey) {
          case "tokens":
          case "icons":
            return accum;
          case "commands": {
            const fn = async () => {
              await mkdir(dirPath, { recursive: true });
            };
            return accum.concat(fn());
          }
          case "docs": {
            const fn = async () => {
              await mkdir(dirPath, { recursive: true });
              const indexFilePath = path6.resolve(dirPath, "./_index.md");
              await writeFile(
                indexFilePath,
                `---
title: Home
---

# Home
`
              );
            };
            return accum.concat(fn());
          }
          default:
            return exhaustiveMatchGuard(configKey);
        }
      },
      []
    );
    await Promise.all(createButteryDirs);
    const butteryConfigPath = path6.resolve(butteryDir, "./config.ts");
    const configJson = configs.reduce(
      (accum, config) => Object.assign(accum, {
        [config]: butteryConfigDefaults[config]
      }),
      {}
    );
    const butteryConfigContent = `import type { ButteryConfig } from "@buttery/cli"
const config: ButteryConfig = ${JSON.stringify(configJson, null, 2)};
export default config
`;
    await writeFile(butteryConfigPath, butteryConfigContent, {
      encoding: "utf8"
    });
  } catch (error) {
    throw `Error when trying to create a default .buttery/config file: ${error}`;
  }
}

// .buttery/commands/_buttery-config/getButteryConfigFile.ts
async function getButteryConfigFile(startingDirectory, options) {
  const prompt = options?.prompt ?? false;
  const defaultConfig = options?.defaultConfig;
  let butteryDir = getButteryDir(startingDirectory);
  if (!butteryDir && prompt) {
    LOG.warning(
      "Cannot locate the `.buttery/config` file in your file structure. Let's create one."
    );
    const userButteryDir = await promptUserForButteryDirLocation(startingDirectory);
    const userButteryConfigDefaults = await promptUserForButteryConfigDefaults({
      message: "Select 1 or many configurations you wish to default",
      defaultChecked: defaultConfig
    });
    butteryDir = userButteryDir;
    await createDefaultButteryConfigAndDirs(
      butteryDir,
      userButteryConfigDefaults
    );
  }
  if (!butteryDir) {
    throw "Cannot locate the `.buttery/config` file in your file structure. Please ensure you have created one.";
  }
  const configFilePath = path7.resolve(butteryDir, "./config.ts");
  let doesConfigFileExist = existsSync(configFilePath);
  if (!doesConfigFileExist && prompt) {
    LOG.warning(
      `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Let's create one.`
    );
    const userDefinedConfigDefaults = await promptUserForButteryConfigDefaults({
      message: "Which configurations would you like to default?",
      defaultChecked: defaultConfig
    });
    await createDefaultButteryConfigAndDirs(
      butteryDir,
      userDefinedConfigDefaults
    );
    doesConfigFileExist = true;
  }
  if (!doesConfigFileExist) {
    throw `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Please add one.`;
  }
  let file = await readFile2(configFilePath);
  let isFileEmpty = file.length === 0;
  if (isFileEmpty && prompt) {
    LOG.warning(
      `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Let's populate it.`
    );
    const userDefinedConfigDefaults = await promptUserForButteryConfigDefaults({
      message: "Which configurations would you like to default?",
      defaultChecked: defaultConfig
    });
    await createDefaultButteryConfigAndDirs(
      butteryDir,
      userDefinedConfigDefaults
    );
    file = await readFile2(configFilePath);
    isFileEmpty = false;
  }
  if (isFileEmpty) {
    throw `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Please add your config.`;
  }
  return {
    path: configFilePath,
    content: file,
    directory: butteryDir
  };
}
function getButteryDir(currentDir) {
  const targetDir = ".buttery";
  const rootDir = path7.parse(currentDir).root;
  function traverseUp(directory) {
    const potentialPath = path7.join(directory, targetDir);
    if (existsSync(potentialPath) && lstatSync(potentialPath).isDirectory()) {
      return potentialPath;
    }
    const parentDir = path7.dirname(directory);
    if (directory === rootDir) {
      return null;
    }
    return traverseUp(parentDir);
  }
  const butteryDir = traverseUp(currentDir);
  return butteryDir;
}

// .buttery/commands/_buttery-config/getButteryConfigModule.ts
import path8 from "node:path";
import esbuild from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/esbuild/lib/main.js";

// tsconfig.library.json
var tsconfig_library_default = {
  compilerOptions: {
    target: "ESNext",
    useDefineForClassFields: true,
    module: "ESNext",
    lib: ["ESNext"],
    skipLibCheck: true,
    moduleResolution: "bundler",
    resolveJsonModule: true,
    isolatedModules: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    noEmit: true,
    declaration: true,
    declarationMap: true,
    jsx: "react-jsx"
  }
};

// utils/ts/util.ts.hash-string.ts
import { createHash } from "node:crypto";
var hashString = (input2) => {
  return createHash("sha256").update(input2).digest("hex");
};

// .buttery/commands/_buttery-config/getButteryConfigModule.ts
async function importButteryConfigModule(butteryConfigPath) {
  try {
    LOG.debug("Importing transpiled '.buttery/config' file...");
    const module = await dynamicImport(butteryConfigPath);
    LOG.debug("Importing transpiled '.buttery/config' file... done.");
    return module.default;
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to import the transpiled '.buttery/config': ${error}`
      )
    );
  }
}
async function getButteryConfigModule(options) {
  const builtConfigOutFile = path8.resolve(
    options.butteryStoreDirectoryPath,
    `./config/${hashString(options.butteryConfigFilePath)}.js`
  );
  try {
    const tsconfigRaw = JSON.stringify(tsconfig_library_default, null, 2);
    const context = await esbuild.context({
      entryPoints: [options.butteryConfigFilePath],
      bundle: true,
      platform: "node",
      target: ["esnext"],
      format: "esm",
      outfile: builtConfigOutFile,
      packages: "external",
      minify: true,
      tsconfigRaw
    });
    LOG.debug("Transpiling the '.buttery/config' file...");
    await context.rebuild();
    LOG.debug("Transpiling the '.buttery/config' file... done.");
    const config = await importButteryConfigModule(builtConfigOutFile);
    return config;
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to transpile and build the '.buttery/config' file: ${error}`
      )
    );
  }
}

// .buttery/commands/_buttery-config/getButteryConfig.ts
var getButteryConfig = async (nestedConfigKey, options) => {
  const optionPrompt = options?.prompt ?? false;
  const optionWatch = options?.watch ?? false;
  const optionDefaultConfig = options?.defaultConfig;
  const optionStartingDirectory = options?.startingDirectory;
  const optionRequireConfig = options?.requireConfig ?? true;
  const searchDirectory = optionStartingDirectory ?? process.cwd();
  const butteryConfigFile = await getButteryConfigFile(searchDirectory, {
    prompt: optionPrompt,
    defaultConfig: optionDefaultConfig
  });
  const butteryStoreDir = await ensureButteryStore({
    butteryDir: butteryConfigFile.directory
  });
  const butteryConfigModule = await getButteryConfigModule({
    butteryConfigFilePath: butteryConfigFile.path,
    butteryStoreDirectoryPath: butteryStoreDir,
    watch: optionWatch
  });
  const butteryConfig = {
    config: butteryConfigModule,
    paths: {
      config: butteryConfigFile.path,
      storeDir: butteryStoreDir,
      butteryDir: butteryConfigFile.directory,
      rootDir: path9.dirname(butteryConfigFile.directory)
    }
  };
  try {
    let nestedConfig = butteryConfig.config[nestedConfigKey];
    if (optionRequireConfig) {
      if (!nestedConfig) {
        throw `Cannot find the "buttery.config.${nestedConfigKey}" configuration object. Please ensure that the "${nestedConfigKey}" exists in your "buttery.config".`;
      }
      if (Object.keys(nestedConfig).length === 0) {
        throw `"buttery.config.${nestedConfigKey}" configuration object is empty. Please ensure that the "${nestedConfigKey}" has values in your "buttery.config".`;
      }
    } else {
      nestedConfig = butteryConfigDefaults[nestedConfigKey];
    }
    const { config, ...restConfig } = butteryConfig;
    return {
      ...restConfig,
      [nestedConfigKey]: nestedConfig
    };
  } catch (error) {
    const err = new Error(error);
    LOG.fatal(err);
    throw err;
  }
};

// .buttery/commands/docs/docs.getButteryDocsConfig.ts
async function getButteryDocsConfig(options) {
  return await getButteryConfig("docs", {
    ...options,
    defaultConfig: "docs"
  });
}

// .buttery/commands/docs/docs.parseMDXFile.ts
import { readFile as readFile3 } from "node:fs/promises";
import path10 from "node:path";
import matter from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/gray-matter/index.js";

// .buttery/commands/docs/docs.parseMDXFileContent.ts
import rehypeParse from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-parse/index.js";
import rehypeSlug from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-slug/index.js";
import rehypeStringify from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/rehype-stringify/index.js";
import remarkMdx from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-mdx/index.js";
import remarkParse from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-parse/index.js";
import remarkRehype from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/remark-rehype/index.js";
import { unified } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/unified/index.js";
import { visit } from "file:///Users/drewdecarme/git/personal/buttery-tools/node_modules/unist-util-visit/index.js";
function parseMDXFileContent(markdownContent) {
  const file = unified().use(remarkParse).use(remarkMdx).use(remarkRehype).use(rehypeSlug).use(rehypeStringify).processSync(markdownContent);
  const tree = unified().use(rehypeParse, { fragment: true }).parse(file.toString());
  const toc = [];
  const stack = [];
  visit(tree, "element", (node) => {
    if (node.tagName.match(/^h[2-3]$/) && node.properties && node.properties.id) {
      const level = Number.parseInt(node.tagName[1], 10);
      const title = node.children.map((child) => {
        if (child.type === "text") return child.value;
        if (child.type === "h1") return "";
        if (child.type === "element" && (child.tagName === "a" || child.tagName === "code")) {
          return child.children.map((aChild) => aChild.value).join("");
        }
        return "";
      }).join("");
      const link = `#${node.properties.id}`;
      const headerItem = {
        level,
        title,
        link,
        children: []
      };
      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      if (stack.length) {
        stack[stack.length - 1].children.push(headerItem);
      } else {
        toc.push(headerItem);
      }
      stack.push(headerItem);
    }
  });
  return { toc };
}

// .buttery/commands/docs/docs.parseFilename.ts
function parseFilename(filename) {
  const filenameArr = filename.split(".");
  const section = filenameArr[0];
  const route = filenameArr.splice(1).join(".");
  return {
    section,
    route: route === "" ? section : route
  };
}

// .buttery/commands/docs/docs.parseMDXFileFrontmatter.ts
async function parseMDXFileFrontmatter({
  frontmatter,
  filename
}) {
  const { route } = parseFilename(filename);
  if (!frontmatter.title) {
    LOG.warning(
      `"${filename}" is missing a frontmatter "title". "${route}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
    );
  }
  if (!frontmatter.meta) {
    LOG.warning(
      `"${filename}" is missing a frontmatter "meta". The route will not contain any page meta information which will impact SEO. Please add meta content.`
    );
  }
  return {
    title: frontmatter?.title ?? route,
    meta: frontmatter.meta ?? []
  };
}

// .buttery/commands/docs/docs.parseMDXFilename.ts
var parseMDXFileName = (fileName) => {
  const allSegments = fileName.split(".");
  const [section, ...segments] = allSegments;
  return {
    section,
    segments
  };
};

// .buttery/commands/docs/docs.parseMDXFile.ts
var parseMdxFile = async ({
  filename,
  fsPath,
  routePath
}) => {
  LOG.debug("Parsing MDX file...", { filename });
  try {
    const rawMdxContent = await readFile3(fsPath, { encoding: "utf8" });
    const { data, content: mdxContent } = matter(rawMdxContent);
    const frontmatter = data;
    const meta = await parseMDXFileFrontmatter({ frontmatter, filename });
    const { toc } = parseMDXFileContent(mdxContent);
    const { segments, section } = parseMDXFileName(filename);
    LOG.debug("Parsing MDX file... done.", { filename });
    return {
      fsPath,
      filename,
      ext: path10.extname(fsPath),
      toc,
      meta,
      section,
      routeAbs: routePath,
      segments
    };
  } catch (error) {
    LOG.error("Error when trying to parse the MDX file.");
    throw LOG.fatal(new Error(error));
  }
};

// .buttery/commands/docs/docs.getButteryDocsGraph.ts
async function getButteryDocsGraph(config, orderedFiles) {
  LOG.debug("Generating graph representation of docs...");
  const graph = {};
  async function insertNode(file) {
    const parsedFile = await parseMdxFile(file);
    if (!parsedFile) return;
    const {
      meta: { title, meta },
      section,
      segments,
      ext,
      routeAbs,
      filename,
      toc
    } = parsedFile;
    const sectionTitle = config.docs?.order?.[section]?.display ?? section.replace(/-/g, " ");
    if (section && !graph[section]) {
      graph[section] = {
        routeTitle: sectionTitle,
        routeMeta: meta,
        filepath: file.fsPath,
        filename,
        fileExtension: ext,
        routeAbs: `/${section === "_index" ? "" : section}`,
        routeRel: section === "_index" ? "/" : section,
        toc: [],
        pages: {}
      };
    }
    let currentGraph = section ? graph[section].pages : graph;
    for (const segmentIndex in segments) {
      const i = Number(segmentIndex);
      const segment = segments[i];
      if (!currentGraph[segment]) {
        currentGraph[segment] = {
          routeTitle: "",
          filepath: "",
          filename: "",
          fileExtension: "",
          routeAbs: "",
          routeRel: "",
          routeMeta: [],
          toc: [],
          pages: {}
        };
      }
      if (i === segments.length - 1) {
        currentGraph[segment].routeTitle = title;
        currentGraph[segment].routeMeta = meta;
        currentGraph[segment].filepath = file.fsPath;
        currentGraph[segment].filename = file.filename;
        currentGraph[segment].fileExtension = ext;
        currentGraph[segment].routeAbs = routeAbs;
        currentGraph[segment].routeRel = segment;
        currentGraph[segment].toc = toc;
      } else {
        currentGraph = currentGraph[segment].pages;
      }
    }
  }
  for (const fileIndex in orderedFiles) {
    const file = orderedFiles[fileIndex];
    await insertNode(file);
  }
  LOG.debug("Generating graph representation of docs... done.");
  return graph;
}

// utils/ts/util.ts.kebab-to-pascal-case.tsx
function kebabToPascalCase(str) {
  return str.split(/[-\s]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
}

// .buttery/commands/docs/docs.autoOrderButteryDocFiles.ts
function autoOrderButteryDocFiles(files) {
  return files.reduce((accum, file) => {
    const { section, route } = parseFilename(file.filename);
    if (section === "_index") return accum;
    const sectionAlreadyAdded = accum[section];
    if (!sectionAlreadyAdded) {
      return Object.assign(accum, {
        [section]: {
          display: kebabToPascalCase(section),
          routeOrder: [route]
        }
      });
    }
    const routeOrder = accum[section].routeOrder;
    routeOrder.push(route);
    routeOrder.sort((a, b) => a.length - b.length);
    const sectionPageIndex = routeOrder.findIndex((route2) => route2 === section);
    if (sectionPageIndex > -1) {
      routeOrder.unshift(routeOrder.splice(sectionPageIndex, 1)[0]);
    }
    return Object.assign(accum, {
      [section]: {
        ...accum[section],
        routeOrder
      }
    });
  }, {});
}

// .buttery/commands/docs/docs.orderButteryDocFiles.ts
function orderButteryDocFiles(docsConfig, files) {
  let reconciledOrder;
  if (!docsConfig.docs.order) {
    LOG.warning("No custom order defined... auto ordering");
    reconciledOrder = autoOrderButteryDocFiles(files);
  } else {
    reconciledOrder = docsConfig.docs.order;
  }
  const oFiles = [];
  for (const section in reconciledOrder) {
    const sectionOrder = reconciledOrder[section].routeOrder;
    for (const sectionRoute of sectionOrder) {
      const sectionIndexFile = files.find((file) => file.filename === section);
      const oFilesHasSectionIndexFile = oFiles.find(
        (f) => f.filename === sectionIndexFile?.filename
      );
      if (!oFilesHasSectionIndexFile && sectionIndexFile) {
        oFiles.push(sectionIndexFile);
      }
      const orderedFile = files.find(
        (file) => file.filename === `${section}.${sectionRoute}`
      );
      if (orderedFile) oFiles.push(orderedFile);
    }
  }
  for (const file of files) {
    const fileAlreadyOrdered = oFiles.find(
      (oFile) => oFile.filename === file.filename
    );
    if (!fileAlreadyOrdered && file.filename === "_index") {
      oFiles.unshift(file);
    } else if (!fileAlreadyOrdered) {
      LOG.warning(
        `No order defined for "${file.filename}". Ordering arbitrarily.`
      );
      oFiles.push(file);
    }
  }
  return oFiles;
}

// .buttery/commands/docs/docs.vite-plugin-mdx-code-examples.ts
import { readFileSync } from "node:fs";
import path11 from "node:path";
function mdxTransformCodeExamples(options) {
  return {
    enforce: "pre",
    name: "vite-plugin-mdx-transform-code",
    transform(code, id) {
      if (!id.endsWith(".mdx")) return;
      let matchNum = 1;
      const regex = /\{\/\* example:"([^"]+)" \*\/\}/g;
      const transformedPreview = code.replace(regex, (_match, p1) => {
        const transformedPath = path11.join(options.rootPath, p1);
        const previewBlockPath = path11.join(
          options.rootPath,
          "/lib/buttery-components/docs/PreviewBlock.tsx"
        );
        const codeBlock = readFileSync(transformedPath, { encoding: "utf8" });
        const newCode = `

import { default as PreviewBlock${matchNum} } from "${previewBlockPath}";
import { default as Component${matchNum} } from "${transformedPath}";

<PreviewBlock${matchNum}>
  <Component${matchNum} />
  \`\`\`tsx
  ${codeBlock}
  \`\`\`
</PreviewBlock${matchNum}>

`;
        matchNum++;
        return newCode;
      });
      const fenceRegex = /\{\/\* fence:"([^"]+)" \*\/\}/g;
      const transformedFence = transformedPreview.replace(
        fenceRegex,
        (_match, p1) => {
          const transformedPath = path11.join(options.rootPath, p1);
          const codeBlock = readFileSync(transformedPath, { encoding: "utf8" });
          return `
\`\`\`tsx
  ${codeBlock}
  \`\`\`
`;
        }
      );
      return {
        code: transformedFence,
        map: null
        // Provide source map if necessary
      };
    }
  };
}

// .buttery/commands/docs/docs.vite-plugin-mdx-transform-imports.ts
import path12 from "node:path";
function mdxTransformImports(options) {
  return {
    enforce: "pre",
    name: "vite-plugin-mdx-transform-imports",
    transform(code, id) {
      if (!id.endsWith(".mdx")) return;
      const transformedStrings = code.replace(
        /['"](~\/[^'"]+)['"]/g,
        (_match, p1) => {
          const relPath = p1.split("~")[1];
          const transformedPath = path12.join(options.rootPath, relPath);
          return `'${transformedPath}'`;
        }
      );
      return {
        code: transformedStrings,
        map: null
        // Provide source map if necessary
      };
    }
  };
}

// .buttery/commands/docs/docs.vite-plugin-transform-markdown-asset-path.ts
function transformMarkdownAssetPath() {
  return {
    enforce: "pre",
    name: "markdown-image-path-transform",
    transform(code, id) {
      if (id.endsWith(".md")) {
        const transformedCode = code.replace(
          /!\[([^\]]*)\]\(\.\/public\/([^)]*)\)/g,
          "![$1](/$2)"
        );
        return {
          code: transformedCode,
          map: null
        };
      }
      return {
        code,
        map: null
      };
    }
  };
}

// .buttery/commands/docs/docs.getButteryDocsViteConfig.ts
async function getButteryDocsViteConfig() {
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const files = await getButteryDocsFiles(config);
  const orderedFiles = orderButteryDocFiles(config, files);
  const graph = await getButteryDocsGraph(config, orderedFiles);
  const baseConfig = {
    root: dirs.artifacts.apps.template.root,
    publicDir: dirs.srcDocs.public,
    resolve: {
      alias: [
        // change the import path to the .buttery/.store
        {
          find: "@buttery/docs/data",
          replacement: dirs.artifacts.apps.template.dataFile
        }
      ]
    },
    optimizeDeps: {
      exclude: ["@buttery/tokens/docs"]
    },
    plugins: [
      wyw({
        include: "/**/*.(ts|tsx)",
        babelOptions: {
          compact: false,
          presets: ["@babel/preset-typescript", "@babel/preset-react"]
        }
      }),
      transformMarkdownAssetPath(),
      mdxTransformImports({
        rootPath: config.paths.rootDir
      }),
      mdxTransformCodeExamples({
        rootPath: config.paths.rootDir
      }),
      mdx({
        include: "/**/*.(md|mdx)",
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [
          rehypeSlug2,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              headingProperties: {
                className: "heading"
              }
            }
          ],
          [
            // @ts-expect-error This is a mismatch from the type-system
            rehypeShiki,
            {
              theme: "dark-plus"
            }
          ]
        ]
      }),
      remixCloudflareDevProxy(),
      remix({
        manifest: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true
        },
        routes(defineRoutes) {
          return defineRoutes((route) => {
            const { _index: indexRoute } = graph;
            route(indexRoute.routeAbs, indexRoute.filepath, { index: true });
            const docsLayoutPath = path13.resolve(
              dirs.artifacts.apps.template.root,
              "./app/routes/_docs.tsx"
            );
            route("", docsLayoutPath, () => {
              for (const file of orderedFiles) {
                if (file.filename === "_index") continue;
                route(file.routePath, file.fsPath, {
                  index: file.filename.includes("_index")
                });
              }
            });
          });
        }
      })
      // watchDocsPlugin(config, dirs)
      // {
      //   name: "watch-buttery-config",
      //   configureServer(server) {
      //     const butteryConfigFilePath = config.paths.config;
      //     LOG.watch(
      //       `Watching the '.buttery/config' file for changes: ${butteryConfigFilePath}`
      //     );
      //     server.watcher.add(butteryConfigFilePath);
      //     server.watcher.on("change", async (file) => {
      //       if (file !== butteryConfigFilePath) return;
      //       try {
      //         LOG.watch(`'.buttery/config' file changed. Rebuilding...`);
      //         const config = await getButteryDocsConfig();
      //         const files = await getButteryDocsFiles(config);
      //         const orderedFiles = orderButteryDocFiles(config, files);
      //         const graph = await getButteryDocsGraph(config, orderedFiles);
      //         await bootstrapAppDataFile({ config, graph });
      //       } catch (error) {
      //         throw LOG.fatal(
      //           new Error(
      //             `Error when rebuilding the '.buttery/config' file: ${error}`
      //           )
      //         );
      //       }
      //     });
      //   }
      // },
      // {
      //   name: "debug",
      //   enforce: "post",
      //   configResolved(resolvedConfig) {
      //     const outpath = path.resolve(
      //       config.paths.storeDir,
      //       "./docs/vite-config.json"
      //     );
      //     ensureFile(outpath).then(() => {
      //       writeFile(outpath, JSON.stringify(resolvedConfig, null, 2));
      //     });
      //   }
      // },
    ]
  };
  return function defineConfig2(fn) {
    const userConfig = fn({ config, dirs });
    return mergeConfig(baseConfig, userConfig);
  };
}

// lib/buttery-docs/apps/cloudflare-pages/vite.config.ts
var defineConfig = await getButteryDocsViteConfig();
var vite_config_default = defineConfig(() => ({}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLmdldEJ1dHRlcnlEb2NzVml0ZUNvbmZpZy50cyIsICIuYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MuZ2V0QnV0dGVyeURvY0ZpbGVzLnRzIiwgInV0aWxzL3RzL3V0aWwudHMuZXhoYXVzdGl2ZS1tYXRjaC1ndWFyZC50cyIsICJsaWIvYnV0dGVyeS1sb2dnZXIvQnV0dGVyeUxvZ2dlci50cyIsICIuYnV0dGVyeS9jb21tYW5kcy9fbG9nZ2VyL3V0aWwudHMubG9nZ2VyLnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy5nZXRCdXR0ZXJ5RG9jc0RpcmVjdG9yaWVzLnRzIiwgInV0aWxzL25vZGUvdXRpbC5ub2RlLmZpbmQtZGlyZWN0b3J5LXVwd2FyZHMudHMiLCAidXRpbHMvbm9kZS91dGlsLm5vZGUuZHluYW1pYy1pbXBvcnQudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnL2dldEJ1dHRlcnlDb25maWcudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnL2J1dHRlcnktY29uZmlnLmRlZmF1bHRzLnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9lbnN1cmVCdXR0ZXJ5U3RvcmUudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnL2Vuc3VyZUdpdGlnbm9yZUVudHJ5LnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9nZXRCdXR0ZXJ5Q29uZmlnRmlsZS50cyIsICIuYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWcvYnV0dGVyeS1jb25maWcudXRpbHMudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnL2dldEJ1dHRlcnlDb25maWdNb2R1bGUudHMiLCAidHNjb25maWcubGlicmFyeS5qc29uIiwgInV0aWxzL3RzL3V0aWwudHMuaGFzaC1zdHJpbmcudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLmdldEJ1dHRlcnlEb2NzQ29uZmlnLnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy5wYXJzZU1EWEZpbGUudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlTURYRmlsZUNvbnRlbnQudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlRmlsZW5hbWUudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlTURYRmlsZUZyb250bWF0dGVyLnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy5wYXJzZU1EWEZpbGVuYW1lLnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy5nZXRCdXR0ZXJ5RG9jc0dyYXBoLnRzIiwgInV0aWxzL3RzL3V0aWwudHMua2ViYWItdG8tcGFzY2FsLWNhc2UudHN4IiwgIi5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy5hdXRvT3JkZXJCdXR0ZXJ5RG9jRmlsZXMudHMiLCAiLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLm9yZGVyQnV0dGVyeURvY0ZpbGVzLnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy52aXRlLXBsdWdpbi1tZHgtY29kZS1leGFtcGxlcy50cyIsICIuYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3Mudml0ZS1wbHVnaW4tbWR4LXRyYW5zZm9ybS1pbXBvcnRzLnRzIiwgIi5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy52aXRlLXBsdWdpbi10cmFuc2Zvcm0tbWFya2Rvd24tYXNzZXQtcGF0aC50cyIsICJsaWIvYnV0dGVyeS1kb2NzL2FwcHMvY2xvdWRmbGFyZS1wYWdlcy92aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL2RvY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy5nZXRCdXR0ZXJ5RG9jc1ZpdGVDb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLmdldEJ1dHRlcnlEb2NzVml0ZUNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCBtZHggZnJvbSBcIkBtZHgtanMvcm9sbHVwXCI7XG5pbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCI7XG5pbXBvcnQgeyBjbG91ZGZsYXJlRGV2UHJveHlWaXRlUGx1Z2luIGFzIHJlbWl4Q2xvdWRmbGFyZURldlByb3h5IH0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCI7XG5pbXBvcnQgcmVoeXBlU2hpa2kgZnJvbSBcIkBzaGlraWpzL3JlaHlwZVwiO1xuaW1wb3J0IHd5dyBmcm9tIFwiQHd5dy1pbi1qcy92aXRlXCI7XG5pbXBvcnQgcmVoeXBlQXV0b2xpbmtIZWFkaW5ncyBmcm9tIFwicmVoeXBlLWF1dG9saW5rLWhlYWRpbmdzXCI7XG5pbXBvcnQgcmVoeXBlU2x1ZyBmcm9tIFwicmVoeXBlLXNsdWdcIjtcbmltcG9ydCByZW1hcmtGcm9udG1hdHRlciBmcm9tIFwicmVtYXJrLWZyb250bWF0dGVyXCI7XG5pbXBvcnQgcmVtYXJrTWR4RnJvbnRtYXR0ZXIgZnJvbSBcInJlbWFyay1tZHgtZnJvbnRtYXR0ZXJcIjtcbmltcG9ydCB7IHR5cGUgVXNlckNvbmZpZywgbWVyZ2VDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgZ2V0QnV0dGVyeURvY3NGaWxlcyB9IGZyb20gXCIuL2RvY3MuZ2V0QnV0dGVyeURvY0ZpbGVzXCI7XG5pbXBvcnQgeyBnZXRCdXR0ZXJ5RG9jc0NvbmZpZyB9IGZyb20gXCIuL2RvY3MuZ2V0QnV0dGVyeURvY3NDb25maWdcIjtcbmltcG9ydCB7IGdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMgfSBmcm9tIFwiLi9kb2NzLmdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXNcIjtcbmltcG9ydCB7IGdldEJ1dHRlcnlEb2NzR3JhcGggfSBmcm9tIFwiLi9kb2NzLmdldEJ1dHRlcnlEb2NzR3JhcGhcIjtcbmltcG9ydCB7IG9yZGVyQnV0dGVyeURvY0ZpbGVzIH0gZnJvbSBcIi4vZG9jcy5vcmRlckJ1dHRlcnlEb2NGaWxlc1wiO1xuaW1wb3J0IHsgbWR4VHJhbnNmb3JtQ29kZUV4YW1wbGVzIH0gZnJvbSBcIi4vZG9jcy52aXRlLXBsdWdpbi1tZHgtY29kZS1leGFtcGxlc1wiO1xuLy8gaW1wb3J0IHsgbWR4VHJhbnNmb3JtQ29kZUV4YW1wbGVzIH0gZnJvbSBcIi4vZG9jcy52aXRlLXBsdWdpbi1tZHgtY29kZS1leGFtcGxlc1wiO1xuaW1wb3J0IHsgbWR4VHJhbnNmb3JtSW1wb3J0cyB9IGZyb20gXCIuL2RvY3Mudml0ZS1wbHVnaW4tbWR4LXRyYW5zZm9ybS1pbXBvcnRzXCI7XG5pbXBvcnQgeyB0cmFuc2Zvcm1NYXJrZG93bkFzc2V0UGF0aCB9IGZyb20gXCIuL2RvY3Mudml0ZS1wbHVnaW4tdHJhbnNmb3JtLW1hcmtkb3duLWFzc2V0LXBhdGhcIjtcbi8vIGltcG9ydCB7IHdhdGNoRG9jc1BsdWdpbiB9IGZyb20gXCIuL2RvY3Mudml0ZS1wbHVnaW4td2F0Y2gtZG9jc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnV0dGVyeURvY3NWaXRlQ29uZmlnKCkge1xuICBjb25zdCBjb25maWcgPSBhd2FpdCBnZXRCdXR0ZXJ5RG9jc0NvbmZpZygpO1xuICBjb25zdCBkaXJzID0gYXdhaXQgZ2V0QnV0dGVyeURvY3NEaXJlY3Rvcmllcyhjb25maWcpO1xuICBjb25zdCBmaWxlcyA9IGF3YWl0IGdldEJ1dHRlcnlEb2NzRmlsZXMoY29uZmlnKTtcbiAgY29uc3Qgb3JkZXJlZEZpbGVzID0gb3JkZXJCdXR0ZXJ5RG9jRmlsZXMoY29uZmlnLCBmaWxlcyk7XG4gIGNvbnN0IGdyYXBoID0gYXdhaXQgZ2V0QnV0dGVyeURvY3NHcmFwaChjb25maWcsIG9yZGVyZWRGaWxlcyk7XG5cbiAgY29uc3QgYmFzZUNvbmZpZzogVXNlckNvbmZpZyA9IHtcbiAgICByb290OiBkaXJzLmFydGlmYWN0cy5hcHBzLnRlbXBsYXRlLnJvb3QsXG4gICAgcHVibGljRGlyOiBkaXJzLnNyY0RvY3MucHVibGljLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiBbXG4gICAgICAgIC8vIGNoYW5nZSB0aGUgaW1wb3J0IHBhdGggdG8gdGhlIC5idXR0ZXJ5Ly5zdG9yZVxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJAYnV0dGVyeS9kb2NzL2RhdGFcIixcbiAgICAgICAgICByZXBsYWNlbWVudDogZGlycy5hcnRpZmFjdHMuYXBwcy50ZW1wbGF0ZS5kYXRhRmlsZVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGV4Y2x1ZGU6IFtcIkBidXR0ZXJ5L3Rva2Vucy9kb2NzXCJdXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICB3eXcoe1xuICAgICAgICBpbmNsdWRlOiBcIi8qKi8qLih0c3x0c3gpXCIsXG4gICAgICAgIGJhYmVsT3B0aW9uczoge1xuICAgICAgICAgIGNvbXBhY3Q6IGZhbHNlLFxuICAgICAgICAgIHByZXNldHM6IFtcIkBiYWJlbC9wcmVzZXQtdHlwZXNjcmlwdFwiLCBcIkBiYWJlbC9wcmVzZXQtcmVhY3RcIl1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0cmFuc2Zvcm1NYXJrZG93bkFzc2V0UGF0aCgpLFxuICAgICAgbWR4VHJhbnNmb3JtSW1wb3J0cyh7XG4gICAgICAgIHJvb3RQYXRoOiBjb25maWcucGF0aHMucm9vdERpclxuICAgICAgfSksXG4gICAgICBtZHhUcmFuc2Zvcm1Db2RlRXhhbXBsZXMoe1xuICAgICAgICByb290UGF0aDogY29uZmlnLnBhdGhzLnJvb3REaXJcbiAgICAgIH0pLFxuICAgICAgbWR4KHtcbiAgICAgICAgaW5jbHVkZTogXCIvKiovKi4obWR8bWR4KVwiLFxuICAgICAgICByZW1hcmtQbHVnaW5zOiBbcmVtYXJrRnJvbnRtYXR0ZXIsIHJlbWFya01keEZyb250bWF0dGVyXSxcbiAgICAgICAgcmVoeXBlUGx1Z2luczogW1xuICAgICAgICAgIHJlaHlwZVNsdWcsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgcmVoeXBlQXV0b2xpbmtIZWFkaW5ncyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYmVoYXZpb3I6IFwid3JhcFwiLFxuICAgICAgICAgICAgICBoZWFkaW5nUHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJoZWFkaW5nXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBUaGlzIGlzIGEgbWlzbWF0Y2ggZnJvbSB0aGUgdHlwZS1zeXN0ZW1cbiAgICAgICAgICAgIHJlaHlwZVNoaWtpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aGVtZTogXCJkYXJrLXBsdXNcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfSksXG4gICAgICByZW1peENsb3VkZmxhcmVEZXZQcm94eSgpLFxuICAgICAgcmVtaXgoe1xuICAgICAgICBtYW5pZmVzdDogdHJ1ZSxcbiAgICAgICAgZnV0dXJlOiB7XG4gICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXG4gICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByb3V0ZXMoZGVmaW5lUm91dGVzKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZmluZVJvdXRlcygocm91dGUpID0+IHtcbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRoZSBpbmRleCByb3V0ZVxuICAgICAgICAgICAgY29uc3QgeyBfaW5kZXg6IGluZGV4Um91dGUgfSA9IGdyYXBoO1xuICAgICAgICAgICAgcm91dGUoaW5kZXhSb3V0ZS5yb3V0ZUFicywgaW5kZXhSb3V0ZS5maWxlcGF0aCwgeyBpbmRleDogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgdGhlIGRvY3MgbGF5b3V0IHJvdXRlXG4gICAgICAgICAgICBjb25zdCBkb2NzTGF5b3V0UGF0aCA9IHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgZGlycy5hcnRpZmFjdHMuYXBwcy50ZW1wbGF0ZS5yb290LFxuICAgICAgICAgICAgICBcIi4vYXBwL3JvdXRlcy9fZG9jcy50c3hcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJvdXRlKFwiXCIsIGRvY3NMYXlvdXRQYXRoLCAoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGFsbCBvZiB0aGUgY2hpbGQgcm91dGVzXG4gICAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBvcmRlcmVkRmlsZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZS5maWxlbmFtZSA9PT0gXCJfaW5kZXhcIikgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICByb3V0ZShmaWxlLnJvdXRlUGF0aCwgZmlsZS5mc1BhdGgsIHtcbiAgICAgICAgICAgICAgICAgIGluZGV4OiBmaWxlLmZpbGVuYW1lLmluY2x1ZGVzKFwiX2luZGV4XCIpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gd2F0Y2hEb2NzUGx1Z2luKGNvbmZpZywgZGlycylcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbmFtZTogXCJ3YXRjaC1idXR0ZXJ5LWNvbmZpZ1wiLFxuICAgICAgLy8gICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAvLyAgICAgY29uc3QgYnV0dGVyeUNvbmZpZ0ZpbGVQYXRoID0gY29uZmlnLnBhdGhzLmNvbmZpZztcbiAgICAgIC8vICAgICBMT0cud2F0Y2goXG4gICAgICAvLyAgICAgICBgV2F0Y2hpbmcgdGhlICcuYnV0dGVyeS9jb25maWcnIGZpbGUgZm9yIGNoYW5nZXM6ICR7YnV0dGVyeUNvbmZpZ0ZpbGVQYXRofWBcbiAgICAgIC8vICAgICApO1xuICAgICAgLy8gICAgIHNlcnZlci53YXRjaGVyLmFkZChidXR0ZXJ5Q29uZmlnRmlsZVBhdGgpO1xuICAgICAgLy8gICAgIHNlcnZlci53YXRjaGVyLm9uKFwiY2hhbmdlXCIsIGFzeW5jIChmaWxlKSA9PiB7XG4gICAgICAvLyAgICAgICBpZiAoZmlsZSAhPT0gYnV0dGVyeUNvbmZpZ0ZpbGVQYXRoKSByZXR1cm47XG4gICAgICAvLyAgICAgICB0cnkge1xuICAgICAgLy8gICAgICAgICBMT0cud2F0Y2goYCcuYnV0dGVyeS9jb25maWcnIGZpbGUgY2hhbmdlZC4gUmVidWlsZGluZy4uLmApO1xuICAgICAgLy8gICAgICAgICBjb25zdCBjb25maWcgPSBhd2FpdCBnZXRCdXR0ZXJ5RG9jc0NvbmZpZygpO1xuICAgICAgLy8gICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGdldEJ1dHRlcnlEb2NzRmlsZXMoY29uZmlnKTtcbiAgICAgIC8vICAgICAgICAgY29uc3Qgb3JkZXJlZEZpbGVzID0gb3JkZXJCdXR0ZXJ5RG9jRmlsZXMoY29uZmlnLCBmaWxlcyk7XG4gICAgICAvLyAgICAgICAgIGNvbnN0IGdyYXBoID0gYXdhaXQgZ2V0QnV0dGVyeURvY3NHcmFwaChjb25maWcsIG9yZGVyZWRGaWxlcyk7XG5cbiAgICAgIC8vICAgICAgICAgYXdhaXQgYm9vdHN0cmFwQXBwRGF0YUZpbGUoeyBjb25maWcsIGdyYXBoIH0pO1xuICAgICAgLy8gICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vICAgICAgICAgdGhyb3cgTE9HLmZhdGFsKFxuICAgICAgLy8gICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgIC8vICAgICAgICAgICAgIGBFcnJvciB3aGVuIHJlYnVpbGRpbmcgdGhlICcuYnV0dGVyeS9jb25maWcnIGZpbGU6ICR7ZXJyb3J9YFxuICAgICAgLy8gICAgICAgICAgIClcbiAgICAgIC8vICAgICAgICAgKTtcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vICAgICB9KTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfSxcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbmFtZTogXCJkZWJ1Z1wiLFxuICAgICAgLy8gICBlbmZvcmNlOiBcInBvc3RcIixcbiAgICAgIC8vICAgY29uZmlnUmVzb2x2ZWQocmVzb2x2ZWRDb25maWcpIHtcbiAgICAgIC8vICAgICBjb25zdCBvdXRwYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgLy8gICAgICAgY29uZmlnLnBhdGhzLnN0b3JlRGlyLFxuICAgICAgLy8gICAgICAgXCIuL2RvY3Mvdml0ZS1jb25maWcuanNvblwiXG4gICAgICAvLyAgICAgKTtcbiAgICAgIC8vICAgICBlbnN1cmVGaWxlKG91dHBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gICAgICAgd3JpdGVGaWxlKG91dHBhdGgsIEpTT04uc3RyaW5naWZ5KHJlc29sdmVkQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAvLyAgICAgfSk7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0sXG4gICAgXVxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBkZWZpbmVDb25maWc8VCBleHRlbmRzIFVzZXJDb25maWcgPSBVc2VyQ29uZmlnPihcbiAgICBmbjogKHBhcmFtczoge1xuICAgICAgY29uZmlnOiB0eXBlb2YgY29uZmlnO1xuICAgICAgZGlyczogdHlwZW9mIGRpcnM7XG4gICAgfSkgPT4gVFxuICApIHtcbiAgICBjb25zdCB1c2VyQ29uZmlnID0gZm4oeyBjb25maWcsIGRpcnMgfSk7XG4gICAgcmV0dXJuIG1lcmdlQ29uZmlnPFVzZXJDb25maWcsIFVzZXJDb25maWc+KGJhc2VDb25maWcsIHVzZXJDb25maWcpO1xuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MuZ2V0QnV0dGVyeURvY0ZpbGVzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy5nZXRCdXR0ZXJ5RG9jRmlsZXMudHNcIjtpbXBvcnQgeyB0eXBlIERpcmVudCwgcmVhZGRpclN5bmMgfSBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0IHsgcmVhZGRpciB9IGZyb20gXCJub2RlOmZzL3Byb21pc2VzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBleGhhdXN0aXZlTWF0Y2hHdWFyZCB9IGZyb20gXCIuLi8uLi8uLi91dGlscy90c1wiO1xuaW1wb3J0IHsgTE9HIH0gZnJvbSBcIi4uL19sb2dnZXIvdXRpbC50cy5sb2dnZXJcIjtcbmltcG9ydCB0eXBlIHsgQnV0dGVyeURvY3NDb25maWcgfSBmcm9tIFwiLi9kb2NzLmdldEJ1dHRlcnlEb2NzQ29uZmlnXCI7XG5pbXBvcnQgeyBnZXRCdXR0ZXJ5RG9jc0RpcmVjdG9yaWVzIH0gZnJvbSBcIi4vZG9jcy5nZXRCdXR0ZXJ5RG9jc0RpcmVjdG9yaWVzXCI7XG5pbXBvcnQgdHlwZSB7IEZpbGVPYmogfSBmcm9tIFwiLi9kb2NzLnR5cGVzXCI7XG5cbmZ1bmN0aW9uIGdldFJvdXRlUGF0aChmaWxlbmFtZTogc3RyaW5nLCBvcHRpb25zPzogeyBzdGF0aWNCYXNlTmFtZT86IHN0cmluZyB9KSB7XG4gIGxldCBiYXNlUGF0aCA9IFwiL1wiO1xuICBpZiAoZmlsZW5hbWUgPT09IFwiX2luZGV4XCIgJiYgb3B0aW9ucz8uc3RhdGljQmFzZU5hbWUpIHtcbiAgICByZXR1cm4gYmFzZVBhdGguY29uY2F0KG9wdGlvbnMuc3RhdGljQmFzZU5hbWUpO1xuICB9XG4gIGNvbnN0IGZpbGVuYW1lU2VnbWVudHMgPSBmaWxlbmFtZS5zcGxpdChcIi5cIik7XG4gIGlmIChvcHRpb25zPy5zdGF0aWNCYXNlTmFtZSkge1xuICAgIGJhc2VQYXRoID0gYmFzZVBhdGguY29uY2F0KGAke29wdGlvbnMuc3RhdGljQmFzZU5hbWV9L2ApO1xuICB9XG4gIHJldHVybiBiYXNlUGF0aC5jb25jYXQoZmlsZW5hbWVTZWdtZW50cy5qb2luKFwiL1wiKSk7XG59XG5cbmZ1bmN0aW9uIHJlYWREaXJDb250ZW50cyhcbiAgZGlyZW50czogRGlyZW50W10sXG4gIG9wdGlvbnM6IHsgcm91dGVQcmVmaXg6IHN0cmluZzsgc3RhdGljQmFzZU5hbWU/OiBzdHJpbmcgfVxuKSB7XG4gIHJldHVybiBkaXJlbnRzLnJlZHVjZTxGaWxlT2JqW10+KChhY2N1bSwgZGlyZW50KSA9PiB7XG4gICAgY29uc3QgaXNGaWxlID0gZGlyZW50LmlzRmlsZSgpO1xuICAgIGlmICghaXNGaWxlKSByZXR1cm4gYWNjdW07XG4gICAgY29uc3QgZnNQYXRoID0gZGlyZW50LnBhcmVudFBhdGguY29uY2F0KFwiL1wiKS5jb25jYXQoZGlyZW50Lm5hbWUpO1xuICAgIGNvbnN0IGJhc2VGaWxlbmFtZSA9IHBhdGgucGFyc2UoZGlyZW50Lm5hbWUpLm5hbWU7XG5cbiAgICBpZiAoYmFzZUZpbGVuYW1lID09PSBcIi5EU19TdG9yZVwiKSB7XG4gICAgICAvLyBpZ25vcmUgTWFjIHNwZWNpZmljIG1ldGEgZmlsZXNcbiAgICAgIHJldHVybiBhY2N1bTtcbiAgICB9XG5cbiAgICBjb25zdCByb3V0ZVBhdGggPSBnZXRSb3V0ZVBhdGgoYmFzZUZpbGVuYW1lLCBvcHRpb25zKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9XG4gICAgICBgJHtvcHRpb25zPy5zdGF0aWNCYXNlTmFtZSA/IGAke29wdGlvbnM/LnN0YXRpY0Jhc2VOYW1lfS5gIDogXCJcIn1gLmNvbmNhdChcbiAgICAgICAgYmFzZUZpbGVuYW1lXG4gICAgICApO1xuXG4gICAgY29uc3Qgcm91dGVGaWxlTmFtZSA9XG4gICAgICBmaWxlbmFtZSA9PT0gXCJfaW5kZXhcIlxuICAgICAgICA/IGZpbGVuYW1lXG4gICAgICAgIDogZmlsZW5hbWVcbiAgICAgICAgICAgIC5zcGxpdChcIi5cIilcbiAgICAgICAgICAgIC5yZWR1Y2U8c3RyaW5nPigoYWNjdW0sIHNlZ21lbnQsIGluZGV4LCBvcmlnQXJyKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLnJvdXRlUHJlZml4LmNvbmNhdChzZWdtZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaW5kZXggPD0gb3JpZ0Fyci5sZW5ndGggLSAxICYmICFvcmlnQXJyLmluY2x1ZGVzKFwiX2luZGV4XCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtLmNvbmNhdChcIl8uXCIuY29uY2F0KHNlZ21lbnQpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gYWNjdW0uY29uY2F0KFwiLlwiLmNvbmNhdChzZWdtZW50KSk7XG4gICAgICAgICAgICB9LCBcIlwiKTtcblxuICAgIHJldHVybiBhY2N1bS5jb25jYXQoe1xuICAgICAgZnNQYXRoLFxuICAgICAgZmlsZW5hbWUsXG4gICAgICByb3V0ZUZpbGVOYW1lLFxuICAgICAgcm91dGVQYXRoXG4gICAgfSk7XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBGZXRjaGVzIHRoZSBmaWxlcyBpbnNpZGUgb2YgdGhlIGJ1dHRlcnkgZG9jcyBkaXJlY3RvcnlcbiAqIGFuZCBlbnJpY2hlcyB0aGVpciBlbnRpcmVzIHdpdGggc29tZSBtb3JlIHBhdGhzIHRvIGJlIHVzZWRcbiAqIGF0IGEgbGF0ZXIgcG9pbnQgaW4gZ3JhcGggYW5kIG9yZGVyIGNyZWF0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnV0dGVyeURvY3NGaWxlcyhcbiAgY29uZmlnOiBCdXR0ZXJ5RG9jc0NvbmZpZ1xuKTogUHJvbWlzZTxGaWxlT2JqW10+IHtcbiAgY29uc3QgZG9jc0RpcmVjdG9yaWVzID0gYXdhaXQgZ2V0QnV0dGVyeURvY3NEaXJlY3Rvcmllcyhjb25maWcpO1xuXG4gIC8vIGdldCB0aGUgZmlsZXMgaW5zaWRlIG9mIHRoZSBkb2NzIGRpcmVjdG9yeVxuICAvLyBhbmQgZW5yaWNoIHRoZW0gd2l0aCBzb21lIG9mIHRoZSBkYXRhXG4gIGNvbnN0IGRvY3NEaXJDb250ZW50cyA9IGF3YWl0IHJlYWRkaXIoZG9jc0RpcmVjdG9yaWVzLnNyY0RvY3Mucm9vdCwge1xuICAgIHJlY3Vyc2l2ZTogZmFsc2UsXG4gICAgd2l0aEZpbGVUeXBlczogdHJ1ZVxuICB9KTtcblxuICBMT0cuaW5mbyhgRGV0ZWN0ZWQgcm91dGVTdHJhdGVneTogJHtjb25maWcuZG9jcy5yb3V0ZVN0cmF0ZWd5fWApO1xuXG4gIGNvbnN0IHJvdXRlU3RyYXRlZ3kgPSBjb25maWcuZG9jcy5yb3V0ZVN0cmF0ZWd5ID8/IFwic2VjdGlvbi1mb2xkZXJzXCI7XG4gIGNvbnN0IHJvdXRlUHJlZml4ID0gXCJfZG9jcy5cIjtcbiAgc3dpdGNoIChyb3V0ZVN0cmF0ZWd5KSB7XG4gICAgY2FzZSBcImZsYXRcIjpcbiAgICAgIHJldHVybiByZWFkRGlyQ29udGVudHMoZG9jc0RpckNvbnRlbnRzLCB7IHJvdXRlUHJlZml4IH0pO1xuXG4gICAgY2FzZSBcInNlY3Rpb24tZm9sZGVyc1wiOiB7XG4gICAgICBjb25zdCBmaWxlcyA9IGRvY3NEaXJDb250ZW50cy5yZWR1Y2U8UmV0dXJuVHlwZTx0eXBlb2YgcmVhZERpckNvbnRlbnRzPj4oXG4gICAgICAgIChhY2N1bSwgZGlyZW50KSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGlyZW50LmlzRmlsZSgpICYmXG4gICAgICAgICAgICAoZGlyZW50Lm5hbWUgPT09IFwiX2luZGV4Lm1kXCIgfHwgZGlyZW50Lm5hbWUgPT09IFwiX2luZGV4Lm1keFwiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIGFjY3VtLmNvbmNhdChyZWFkRGlyQ29udGVudHMoW2RpcmVudF0sIHsgcm91dGVQcmVmaXggfSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIExPRy5kZWJ1ZyhgUmVhZGluZyBcIiR7ZGlyZW50Lm5hbWV9XCIuIFNraXBwaW5nIFwiL3B1YmxpY1wiICYgXCIvZGlzdFwiYCk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGlyZW50LmlzRGlyZWN0b3J5KCkgJiZcbiAgICAgICAgICAgIGRpcmVudC5uYW1lICE9PSBcInB1YmxpY1wiICYmXG4gICAgICAgICAgICBkaXJlbnQubmFtZSAhPT0gXCJkaXN0XCJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25EaXIgPSBwYXRoLnJlc29sdmUoZGlyZW50LnBhcmVudFBhdGgsIGRpcmVudC5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25EaXJDb250ZW50cyA9IHJlYWRkaXJTeW5jKHNlY3Rpb25EaXIsIHtcbiAgICAgICAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICB3aXRoRmlsZVR5cGVzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2N1bS5jb25jYXQoXG4gICAgICAgICAgICAgIHJlYWREaXJDb250ZW50cyhzZWN0aW9uRGlyQ29udGVudHMsIHtcbiAgICAgICAgICAgICAgICByb3V0ZVByZWZpeCxcbiAgICAgICAgICAgICAgICBzdGF0aWNCYXNlTmFtZTpcbiAgICAgICAgICAgICAgICAgIGRpcmVudC5uYW1lICE9PSBcIl9pbmRleFwiID8gZGlyZW50Lm5hbWUgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2N1bTtcbiAgICAgICAgfSxcbiAgICAgICAgW11cbiAgICAgICk7XG4gICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBleGhhdXN0aXZlTWF0Y2hHdWFyZChyb3V0ZVN0cmF0ZWd5KTtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy91dGlscy90c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvdXRpbHMvdHMvdXRpbC50cy5leGhhdXN0aXZlLW1hdGNoLWd1YXJkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzL3V0aWxzL3RzL3V0aWwudHMuZXhoYXVzdGl2ZS1tYXRjaC1ndWFyZC50c1wiO2V4cG9ydCBjb25zdCBleGhhdXN0aXZlTWF0Y2hHdWFyZCA9IChfOiBuZXZlcik6IG5ldmVyID0+IHtcbiAgdGhyb3cgbmV3IEVycm9yKGBGb3Jnb3QgdG8gaW5jbHVkZSBhbiBcIiR7X31cIiBpbiB0aGUgc3dpdGNoIHN0YXRlbWVudGApO1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvbGliL2J1dHRlcnktbG9nZ2VyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy9saWIvYnV0dGVyeS1sb2dnZXIvQnV0dGVyeUxvZ2dlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy9saWIvYnV0dGVyeS1sb2dnZXIvQnV0dGVyeUxvZ2dlci50c1wiO2ltcG9ydCBjaGFsaywgeyB0eXBlIENoYWxrIH0gZnJvbSBcImNoYWxrXCI7XG5cbnR5cGUgQnV0dGVyeUxvZ2dlck9wdGlvbkxldmVsID0gXCJpbmZvXCIgfCBcInRpbWVyXCIgfCBcImRlYnVnXCIgfCBcIndhcm5cIiB8IFwiZXJyb3JcIjtcbnR5cGUgQnV0dGVyeUxvZ2dlck9wdGlvbkZvcm1hdCA9IFwianNvblwiIHwgXCJiYXNpY1wiO1xuXG50eXBlIEJ1dHRlcnlMb2dnZXJPcHRpb25zID0ge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHRoaW5nIHRoYXQgd2lsbCBiZSBsb2dnaW5nLiBUaGlzIGlzIHVzZWRcbiAgICogdG8gZWFzaWx5IGlkZW50aWZ5IGFuZCBuYW1lIHRoZSBsb2dcbiAgICovXG4gIHByZWZpeDogc3RyaW5nO1xuICAvKipcbiAgICogLSBgaW5mb2AgLSBEaXNwbGF5cyBtZXNzYWdlcyBmcm9tIGFsbCBsb2dnZXJzXG4gICAqIC0gYHRpbWVyYCAtIERpc3BsYXlzIG1lc3NhZ2VzIGZyb20gYGVycm9yYCwgYHdhcm5gLCBgZGVidWdgLCBgdGltZXJgXG4gICAqIFRPRE86IEZpbmlzaCB0aGUgZGVzY3JpcHRpb24gaGVyZVxuICAgKi9cbiAgbG9nTGV2ZWw/OiBCdXR0ZXJ5TG9nZ2VyT3B0aW9uTGV2ZWw7XG4gIGZvcm1hdD86IEJ1dHRlcnlMb2dnZXJPcHRpb25Gb3JtYXQ7XG4gIC8qKlxuICAgKiBBIGJvb2xlYW4gdmFsdWUgdGhhdCBkZXRlcm1pbmVzIGlmIHRoZSBsZXZlbFxuICAgKiBzaG91bGQgYmUgcHJpbnRlZCBhbG9uZyB3aXRoIHRoZSBtZXNzYWdlXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBzaG91bGRQcmludExldmVsPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjbGFzcyBCdXR0ZXJ5TG9nZ2VyIHtcbiAgcHJpdmF0ZSBsb2dMZXZlbDogQnV0dGVyeUxvZ2dlck9wdGlvbkxldmVsO1xuICBwcml2YXRlIGxvZ0xldmVsVmFsdWU6IHsgW2tleSBpbiBCdXR0ZXJ5TG9nZ2VyT3B0aW9uTGV2ZWxdOiBudW1iZXIgfTtcbiAgcHJpdmF0ZSBsb2dMZXZlbENvbG9yOiB7IFtrZXkgaW4gQnV0dGVyeUxvZ2dlck9wdGlvbkxldmVsXTogQ2hhbGsgfTtcbiAgLy8gICBwcml2YXRlIGZvcm1hdDogQnV0dGVyeUxvZ2dlck9wdGlvbkZvcm1hdDtcbiAgcHJpdmF0ZSBwcmVmaXg6IHN0cmluZztcbiAgcHJpdmF0ZSBsb2dMZXZlbFN0cmluZ01heExlbmd0aDogbnVtYmVyO1xuICBwcml2YXRlIHNob3VsZFByaW50TGV2ZWw6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQnV0dGVyeUxvZ2dlck9wdGlvbnMpIHtcbiAgICB0aGlzLnByZWZpeCA9IG9wdGlvbnMucHJlZml4O1xuICAgIHRoaXMubG9nTGV2ZWwgPSBvcHRpb25zLmxvZ0xldmVsID8/IFwiaW5mb1wiO1xuICAgIHRoaXMubG9nTGV2ZWxWYWx1ZSA9IHtcbiAgICAgIGluZm86IDUsXG4gICAgICB0aW1lcjogNCxcbiAgICAgIGRlYnVnOiAzLFxuICAgICAgd2FybjogMixcbiAgICAgIGVycm9yOiAxXG4gICAgfTtcbiAgICB0aGlzLmxvZ0xldmVsQ29sb3IgPSB7XG4gICAgICBpbmZvOiBjaGFsay5ib2xkLmJsdWUsXG4gICAgICB0aW1lcjogY2hhbGsuYm9sZC55ZWxsb3dCcmlnaHQsXG4gICAgICBkZWJ1ZzogY2hhbGsuYm9sZC5tYWdlbnRhLFxuICAgICAgd2FybjogY2hhbGsuYm9sZC55ZWxsb3csXG4gICAgICBlcnJvcjogY2hhbGsuYm9sZC5yZWRcbiAgICB9O1xuICAgIHRoaXMuc2hvdWxkUHJpbnRMZXZlbCA9IG9wdGlvbnMuc2hvdWxkUHJpbnRMZXZlbCA/PyBmYWxzZTtcbiAgICB0aGlzLmxvZ0xldmVsU3RyaW5nTWF4TGVuZ3RoID0gT2JqZWN0LmtleXModGhpcy5sb2dMZXZlbENvbG9yKS5yZWR1Y2UoXG4gICAgICAoYWNjdW0sIGxvZ0xldmVsKSA9PiAobG9nTGV2ZWwubGVuZ3RoID4gYWNjdW0gPyBsb2dMZXZlbC5sZW5ndGggOiBhY2N1bSksXG4gICAgICAwXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdG8gcHVibGljbHkgc2V0IHRoZSBsb2dMZXZlbFxuICAgKiB0byBkaXNwbGF5IHRoZSBhcHByb3ByaWF0ZSBsb2dzIGF0XG4gICAqIHRoZSBhcHByb3ByaWF0ZSB0aW1lc1xuICAgKiBUT0RPOiBUaGlzIHN0aWxsIGlzbid0IHdvcmtpbmdcbiAgICovXG4gIHNldCBsZXZlbChsZXZlbDogQnV0dGVyeUxvZ2dlck9wdGlvbkxldmVsKSB7XG4gICAgdGhpcy5sb2dMZXZlbCA9IGxldmVsO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmludExldmVsKGxldmVsOiBCdXR0ZXJ5TG9nZ2VyT3B0aW9uTGV2ZWwpIHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkUHJpbnRMZXZlbCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMubG9nTGV2ZWxDb2xvcltsZXZlbF07XG4gICAgY29uc3QgbGV2ZWxTdHJpbmcgPSBgWyR7bGV2ZWwudG9VcHBlckNhc2UoKX1dYDtcbiAgICBjb25zdCBwYWRkZWRMZXZlbFN0cmluZyA9IGxldmVsU3RyaW5nLnBhZEVuZChcbiAgICAgIHRoaXMubG9nTGV2ZWxTdHJpbmdNYXhMZW5ndGggKyAyLFxuICAgICAgXCIgXCJcbiAgICApO1xuICAgIHJldHVybiBjb2xvcihwYWRkZWRMZXZlbFN0cmluZyk7XG4gIH1cblxuICBwcml2YXRlIHByaW50VGltZXN0YW1wKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZGF0ZVRpbWVGb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChcImVuXCIsIHtcbiAgICAgIHRpbWVTdHlsZTogXCJtZWRpdW1cIlxuICAgIH0pO1xuICAgIGNvbnN0IHRpbWVzdGFtcFN0cmluZyA9IGNoYWxrLmdyYXkoYFske2RhdGVUaW1lRm9ybWF0LmZvcm1hdChub3cpfV1gKTtcblxuICAgIHJldHVybiB0aW1lc3RhbXBTdHJpbmc7XG4gIH1cblxuICBwcml2YXRlIHByaW50UHJlZml4KCkge1xuICAgIHJldHVybiBjaGFsay5iZ0JsYWNrKGBbJHt0aGlzLnByZWZpeH1dYCk7XG4gIH1cblxuICBwcml2YXRlIHNob3VsZExvZyhsZXZlbDogQnV0dGVyeUxvZ2dlck9wdGlvbkxldmVsKSB7XG4gICAgY29uc3QgY2xhc3NOdW1lcmljTGV2ZWwgPSB0aGlzLmxvZ0xldmVsVmFsdWVbdGhpcy5sb2dMZXZlbF07XG4gICAgY29uc3Qgc3VwcGxpZWROdW1lcmljTGV2ZWwgPSB0aGlzLmxvZ0xldmVsVmFsdWVbbGV2ZWxdO1xuXG4gICAgcmV0dXJuIGNsYXNzTnVtZXJpY0xldmVsID49IHN1cHBsaWVkTnVtZXJpY0xldmVsO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2coXG4gICAge1xuICAgICAgbGV2ZWwsXG4gICAgICBtZXNzYWdlLFxuICAgICAgbWV0aG9kXG4gICAgfToge1xuICAgICAgbGV2ZWw6IEJ1dHRlcnlMb2dnZXJPcHRpb25MZXZlbDtcbiAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICAgIG1ldGhvZDogc3RyaW5nO1xuICAgIH0sXG4gICAgLi4uZXh0cmFTZXJpYWxpemFibGVEYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdXG4gICkge1xuICAgIGlmICghdGhpcy5zaG91bGRMb2cobGV2ZWwpKSByZXR1cm47XG5cbiAgICBjb25zdCBtZXNzYWdlU3RyaW5nID0gY2hhbGsuZ3JheShtZXNzYWdlKTtcblxuICAgIGNvbnN0IGxvZ01lc3NhZ2UgPSBbXG4gICAgICB0aGlzLnByaW50VGltZXN0YW1wKCksXG4gICAgICB0aGlzLnByaW50TGV2ZWwobGV2ZWwpLFxuICAgICAgdGhpcy5wcmludFByZWZpeCgpLFxuICAgICAgbWV0aG9kLFxuICAgICAgbWVzc2FnZVN0cmluZ1xuICAgIF1cbiAgICAgIC5maWx0ZXIoKHZhbCkgPT4gdHlwZW9mIHZhbCAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgIC5qb2luKFwiIFwiKTtcblxuICAgIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcbiAgICB9XG5cbiAgICBpZiAoZXh0cmFTZXJpYWxpemFibGVEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGxvZ01lc3NhZ2UpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgbG9nTWVzc2FnZSxcbiAgICAgIC4uLmV4dHJhU2VyaWFsaXphYmxlRGF0YS5tYXAoKGRhdGEpID0+IHRoaXMuZm9ybWF0TG9nRGF0YShkYXRhKSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBmb3JtYXRMb2dEYXRhKGRhdGE/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xuICAgIGlmICghZGF0YSkgcmV0dXJuIFwiXCI7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGRlYnVnKG1lc3NhZ2U6IHN0cmluZywgLi4uZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj5bXSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IGNoYWxrLmJsdWUoYFx1MjVDRiAke2NoYWxrLnVuZGVybGluZShcImRlYnVnXCIpfWApO1xuICAgIHRoaXMubG9nKHsgbGV2ZWw6IFwiaW5mb1wiLCBtZXRob2QsIG1lc3NhZ2UgfSwgLi4uZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgc3VjY2VzcyhtZXNzYWdlOiBzdHJpbmcsIC4uLmRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+W10pIHtcbiAgICBjb25zdCBtZXRob2QgPSBjaGFsay5ncmVlbihgXHUyNzEzICR7Y2hhbGsudW5kZXJsaW5lKFwic3VjY2Vzc1wiKX1gKTtcbiAgICB0aGlzLmxvZyh7IGxldmVsOiBcImluZm9cIiwgbWV0aG9kLCBtZXNzYWdlIH0sIC4uLmRhdGEpO1xuICB9XG5cbiAgcHVibGljIHdhcm5pbmcobWVzc2FnZTogc3RyaW5nLCAuLi5kYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdKSB7XG4gICAgY29uc3QgbWV0aG9kID0gY2hhbGsueWVsbG93QnJpZ2h0KGAhICR7Y2hhbGsudW5kZXJsaW5lKFwid2FybmluZ1wiKX1gKTtcbiAgICB0aGlzLmxvZyh7IGxldmVsOiBcIndhcm5cIiwgbWV0aG9kLCBtZXNzYWdlIH0sIC4uLmRhdGEpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgLi4uZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj5bXSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IGNoYWxrLnJlZChgXHUyNzE1ICR7Y2hhbGsudW5kZXJsaW5lKFwiZXJyb3JcIil9YCk7XG4gICAgdGhpcy5sb2coeyBsZXZlbDogXCJlcnJvclwiLCBtZXRob2QsIG1lc3NhZ2UgfSwgLi4uZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgd2F0Y2gobWVzc2FnZTogc3RyaW5nLCAuLi5kYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPltdKSB7XG4gICAgY29uc3QgbWV0aG9kID0gY2hhbGsuaGV4KFwiI0ZGQTUwMFwiKShgXHUyOUJGICR7Y2hhbGsudW5kZXJsaW5lKFwid2F0Y2hpbmdcIil9YCk7XG4gICAgdGhpcy5sb2coeyBsZXZlbDogXCJlcnJvclwiLCBtZXRob2QsIG1lc3NhZ2UgfSwgLi4uZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgaW5mbyhtZXNzYWdlOiBzdHJpbmcsIC4uLmRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+W10pIHtcbiAgICBjb25zdCBtZXRob2QgPSBjaGFsay5ibHVlQnJpZ2h0KGBcdTIxMzlcdUZFMEUgJHtjaGFsay51bmRlcmxpbmUoXCJpbmZvXCIpfWApO1xuICAgIHRoaXMubG9nKHsgbGV2ZWw6IFwiaW5mb1wiLCBtZXRob2QsIG1lc3NhZ2UgfSwgLi4uZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgZmF0YWwoZXJyb3I6IEVycm9yKSB7XG4gICAgY29uc3QgbWV0aG9kID0gY2hhbGsucmVkQnJpZ2h0LmJvbGQoYFx1MjcxNSAke2NoYWxrLnVuZGVybGluZShcImZhdGFsXCIpfWApO1xuICAgIHRoaXMubG9nKHsgbGV2ZWw6IFwiZXJyb3JcIiwgbWV0aG9kLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xuICAgIGlmICghdGhpcy5zaG91bGRMb2coXCJlcnJvclwiKSkgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKGBcbiR7Y2hhbGsuZ3JleShcbiAgZXJyb3Iuc3RhY2s/LnJlcGxhY2UoXG4gICAgYEVycm9yOiAke2Vycm9yLm1lc3NhZ2V9XG5gLFxuICAgIFwiXCJcbiAgKVxuKX0gICAgXG4gICAgYCk7XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvX2xvZ2dlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvX2xvZ2dlci91dGlsLnRzLmxvZ2dlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fbG9nZ2VyL3V0aWwudHMubG9nZ2VyLnRzXCI7aW1wb3J0IHsgQnV0dGVyeUxvZ2dlciB9IGZyb20gXCIuLi8uLi8uLi9saWIvYnV0dGVyeS1sb2dnZXJcIjtcblxuZXhwb3J0IGNvbnN0IExPRyA9IG5ldyBCdXR0ZXJ5TG9nZ2VyKHtcbiAgcHJlZml4OiBcImJ1dHRlcnlcIixcbiAgbG9nTGV2ZWw6IFwiaW5mb1wiXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLmdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLmdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBmaW5kRGlyZWN0b3J5VXB3YXJkcyB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9ub2RlXCI7XG5pbXBvcnQgdHlwZSB7IEJ1dHRlcnlEb2NzQ29uZmlnIH0gZnJvbSBcIi4vZG9jcy5nZXRCdXR0ZXJ5RG9jc0NvbmZpZ1wiO1xuXG5leHBvcnQgdHlwZSBCdXR0ZXJ5RG9jc0RpcmVjdG9yaWVzID0gQXdhaXRlZDxcbiAgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0QnV0dGVyeURvY3NEaXJlY3Rvcmllcz5cbj47XG5cbi8qKlxuICogUmV0dXJucyBzb21lIGFic29sdXRlIHBhdGggZGlyZWN0b3JpZXMgZm9yIGVhc2lseSByZWZlcmVuY2luZyBkaXJlY3Rvcmllc1xuICogdGhhdCB3ZSBzaG91bGQgYmUgcHVsbGluZyBmaWxlcyBmcm9tIG9yIHNlcnZpbmcgY29udGVudC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEJ1dHRlcnlEb2NzRGlyZWN0b3JpZXMoY29uZmlnOiBCdXR0ZXJ5RG9jc0NvbmZpZykge1xuICBjb25zdCB1c2VyQ3JlYXRlZERvY3NEaXIgPSBwYXRoLnJlc29sdmUoY29uZmlnLnBhdGhzLmJ1dHRlcnlEaXIsIFwiLi9kb2NzXCIpO1xuXG4gIGNvbnN0IGxpYiA9IGZpbmREaXJlY3RvcnlVcHdhcmRzKFwibGliXCIsIHVuZGVmaW5lZCwge1xuICAgIHN0YXJ0aW5nRGlyZWN0b3J5OiBpbXBvcnQubWV0YS5kaXJuYW1lXG4gIH0pO1xuXG4gIGlmICghbGliKSB7XG4gICAgdGhyb3cgXCJDYW5ub3QgbG9jYXRlIGxpYiBkaXJlY3RvcnkgdG8gYnVpbGQgZG9jdW1lbnRhdGlvbiBzaXRlLiBUaGlzIHNob3VsZCBub3QgaGF2ZSBoYXBwZW5lZC4gUGxlYXNlIGxvZyBhIEdpdGh1YiBpc3N1ZS5cIjtcbiAgfVxuXG4gIC8vIGxpYiBkaXJlY3Rvcmllc1xuICBjb25zdCBhcnRpZmFjdHNSb290RGlyID0gcGF0aC5yZXNvbHZlKGxpYiwgXCIuL2J1dHRlcnktZG9jc1wiKTtcbiAgY29uc3QgbGliQXBwc0RpciA9IHBhdGgucmVzb2x2ZShhcnRpZmFjdHNSb290RGlyLCBcIi4vYXBwc1wiKTtcbiAgY29uc3QgbGliQ29tcG9uZW50c0RpciA9IHBhdGgucmVzb2x2ZShhcnRpZmFjdHNSb290RGlyLCBcIi4vY29tcG9uZW50c1wiKTtcbiAgY29uc3QgbGliTGliRGlyID0gcGF0aC5yZXNvbHZlKGFydGlmYWN0c1Jvb3REaXIsIFwiLi9saWJcIik7XG5cbiAgLy8gYXBwcyBkaXJlY3Rvcmllc1xuICBjb25zdCB0ZW1wbGF0ZU5hbWUgPSBgLi8ke2NvbmZpZy5kb2NzLmJ1aWxkVGFyZ2V0fWA7XG5cbiAgY29uc3QgYXBwVGVtcGxhdGVSb290RGlyID0gcGF0aC5yZXNvbHZlKGxpYkFwcHNEaXIsIHRlbXBsYXRlTmFtZSk7XG5cbiAgLy8gb3V0cHV0IGRpcnNcbiAgY29uc3Qgb3V0cHV0Um9vdERpciA9IHBhdGgucmVzb2x2ZSh1c2VyQ3JlYXRlZERvY3NEaXIsIFwiLi9kaXN0XCIpO1xuICBjb25zdCBvdXRwdXRCdW5kbGVEaXIgPSBwYXRoLnJlc29sdmUob3V0cHV0Um9vdERpciwgXCIuL2J1aWxkXCIpO1xuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogVGhlIGRvY3MgdGhhdCBhcmUgY3JlYXRlZCBhbmQgc3RvcmVkIGJ5IHRoZSB1c2VyLiBUaGlzIGlzIHdoZXJlXG4gICAgICogdGhleSBjcmVhdGUgdGhlaXIgbWFya2Rvd258bWR4IGZpbGVzIHRvIHRoZW4gYmUgY3JlYXRlZCBpbnRvXG4gICAgICogdGhlIGFwcFxuICAgICAqL1xuICAgIHNyY0RvY3M6IHtcbiAgICAgIHJvb3Q6IHVzZXJDcmVhdGVkRG9jc0RpcixcbiAgICAgIHB1YmxpYzogcGF0aC5yZXNvbHZlKHVzZXJDcmVhdGVkRG9jc0RpciwgXCIuL3B1YmxpY1wiKVxuICAgIH0sXG4gICAgYXJ0aWZhY3RzOiB7XG4gICAgICByb290OiBhcnRpZmFjdHNSb290RGlyLFxuICAgICAgYXBwczoge1xuICAgICAgICByb290OiBsaWJBcHBzRGlyLFxuICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgIHJvb3Q6IGFwcFRlbXBsYXRlUm9vdERpcixcbiAgICAgICAgICB2aXRlQ29uZmlnOiBwYXRoLnJlc29sdmUoYXBwVGVtcGxhdGVSb290RGlyLCBcIi4vdml0ZS5jb25maWcudHNcIiksXG4gICAgICAgICAgZGF0YUZpbGU6IHBhdGgucmVzb2x2ZShjb25maWcucGF0aHMuc3RvcmVEaXIsIFwiLi9kb2NzL2RhdGEuanNcIilcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbXBvbmVudHM6IGxpYkNvbXBvbmVudHNEaXIsXG4gICAgICBsaWI6IGxpYkxpYkRpclxuICAgIH0sXG4gICAgb3V0cHV0OiB7XG4gICAgICByb290OiBvdXRwdXRSb290RGlyLFxuICAgICAgYnVuZGxlRGlyOiBvdXRwdXRCdW5kbGVEaXJcbiAgICB9XG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzL3V0aWxzL25vZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzL3V0aWxzL25vZGUvdXRpbC5ub2RlLmZpbmQtZGlyZWN0b3J5LXVwd2FyZHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvdXRpbHMvbm9kZS91dGlsLm5vZGUuZmluZC1kaXJlY3RvcnktdXB3YXJkcy50c1wiO2ltcG9ydCBmcyBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHNlYXJjaGVzIHVwIHRoZSBkaXJlY3RvcnkgdHJlZSB0byBmaW5kIGEgZm9sZGVyIHdpdGggYSBzcGVjaWZpYyBuYW1lLFxuICogYW5kIGlmIGZvdW5kLCBjaGVja3MgZm9yIGEgbmVzdGVkIGRpcmVjdG9yeSB3aXRoaW4gaXQuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEFzc3VtaW5nIHRoZSBmb2xsb3dpbmcgZGlyZWN0b3J5IHN0cnVjdHVyZTpcbiAqIC8vIC9ob21lL3VzZXIvcHJvamVjdC9cbiAqIC8vIFx1MjUxQ1x1MjUwMFx1MjUwMCBub2RlX21vZHVsZXNcbiAqIC8vIFx1MjUwMiAgIFx1MjUxNFx1MjUwMFx1MjUwMCBuZXN0ZWREaXJcbiAqIC8vIFx1MjUxQ1x1MjUwMFx1MjUwMCBzcmNcbiAqIC8vIFx1MjUwMiAgIFx1MjUxNFx1MjUwMFx1MjUwMCBpbmRleC5qc1xuICogLy8gXHUyNTE0XHUyNTAwXHUyNTAwIHBhY2thZ2UuanNvblxuICpcbiAqIC8vIElmIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5IGlzIC9ob21lL3VzZXIvcHJvamVjdC9zcmNcbiAqIC8vIGFuZCB3ZSBzZWFyY2ggZm9yICdub2RlX21vZHVsZXMnIGFuZCAnbmVzdGVkRGlyJywgdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuOlxuICogY29uc3QgcmVzdWx0ID0gZmluZERpcmVjdG9yeVVwd2FyZHMoJ25vZGVfbW9kdWxlcycsICduZXN0ZWREaXInKTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdCk7IC8vIC9ob21lL3VzZXIvcHJvamVjdC9ub2RlX21vZHVsZXMvbmVzdGVkRGlyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRGlyZWN0b3J5VXB3YXJkcyhcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBkaXJlY3RvcnkgdG8gc2VhcmNoIGZvci5cbiAgICovXG4gIGRpck5hbWU6IHN0cmluZyxcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBuZXN0ZWQgZGlyZWN0b3J5IHRvIHNlYXJjaCBmb3Igd2l0aGluIHRoZSBmb3VuZCBkaXJlY3RvcnkuXG4gICAqL1xuICBuZXN0ZWREaXJOYW1lPzogc3RyaW5nLFxuICAvKipcbiAgICogT3B0aW9uYWwgcGFyYW1ldGVycy5cbiAgICovXG4gIG9wdGlvbnM/OiB7XG4gICAgLyoqXG4gICAgICogVGhlIGRpcmVjdG9yeSB0byBzdGFydCB0aGUgc2VhcmNoIGZyb20uXG4gICAgICogQGRlZmF1bHQgcHJvY2Vzcy5jd2QoKVxuICAgICAqL1xuICAgIHN0YXJ0aW5nRGlyZWN0b3J5Pzogc3RyaW5nO1xuICB9XG4pIHtcbiAgY29uc3Qgc3RhcnRpbmdEaXJlY3RvcnkgPSBvcHRpb25zPy5zdGFydGluZ0RpcmVjdG9yeSA/PyBwcm9jZXNzLmN3ZCgpO1xuXG4gIGxldCBjdXJyZW50RGlyZWN0b3J5ID0gcGF0aC5yZXNvbHZlKHN0YXJ0aW5nRGlyZWN0b3J5KTtcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIENoZWNrIGlmIHRoZSB0YXJnZXQgZGlyZWN0b3J5IGV4aXN0cyBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnlcbiAgICBjb25zdCBjb250ZW50cyA9IGZzLnJlYWRkaXJTeW5jKGN1cnJlbnREaXJlY3RvcnkpO1xuICAgIGlmIChjb250ZW50cy5pbmNsdWRlcyhkaXJOYW1lKSkge1xuICAgICAgY29uc3QgdGFyZ2V0RGlyUGF0aCA9IHBhdGguam9pbihjdXJyZW50RGlyZWN0b3J5LCBkaXJOYW1lKTtcblxuICAgICAgLy8gSWYgYSBuZXN0ZWQgZGlyZWN0b3J5IG5hbWUgaXMgcHJvdmlkZWQsIGNoZWNrIGZvciBpdHMgZXhpc3RlbmNlXG4gICAgICBpZiAobmVzdGVkRGlyTmFtZSkge1xuICAgICAgICBjb25zdCBuZXN0ZWRDb250ZW50cyA9IGZzLnJlYWRkaXJTeW5jKHRhcmdldERpclBhdGgpO1xuICAgICAgICBpZiAobmVzdGVkQ29udGVudHMuaW5jbHVkZXMobmVzdGVkRGlyTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gcGF0aC5qb2luKHRhcmdldERpclBhdGgsIG5lc3RlZERpck5hbWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGFyZ2V0RGlyUGF0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNb3ZlIHVwIG9uZSBsZXZlbFxuICAgIGNvbnN0IHBhcmVudERpcmVjdG9yeSA9IHBhdGguZGlybmFtZShjdXJyZW50RGlyZWN0b3J5KTtcblxuICAgIC8vIElmIHdlJ3ZlIHJlYWNoZWQgdGhlIHJvb3QgZGlyZWN0b3J5IHdpdGhvdXQgZmluZGluZyB0aGUgdGFyZ2V0LCByZXR1cm4gbnVsbFxuICAgIGlmIChwYXJlbnREaXJlY3RvcnkgPT09IGN1cnJlbnREaXJlY3RvcnkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGN1cnJlbnREaXJlY3RvcnkgPSBwYXJlbnREaXJlY3Rvcnk7XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvdXRpbHMvbm9kZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvdXRpbHMvbm9kZS91dGlsLm5vZGUuZHluYW1pYy1pbXBvcnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvdXRpbHMvbm9kZS91dGlsLm5vZGUuZHluYW1pYy1pbXBvcnQudHNcIjsvKipcbiAqIER5bmFtaWNhbGx5IGltcG9ydCBhIGZpbGUgYnkgY2FjaGUgYnVzdGluZyB0aGUgaW1wb3J0XG4gKiBjYWNoZSBieSBhZGRpbmcgYSBudW1iZXIgcmVwcmVzZW50YXRpb24gb2Ygbm93LiBUaGlzIGZvcmNlc1xuICogaW1wb3J0IHRvIGdvIG91dCBhbmQgZmV0Y2ggYSBuZXcgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkeW5hbWljSW1wb3J0KG1vZHVsZVBhdGg6IHN0cmluZykge1xuICAvLyBDb25zdHJ1Y3QgYSBuZXcgaW1wb3J0IHNwZWNpZmllciB3aXRoIGEgdW5pcXVlIFVSTCB0aW1lc3RhbXAgcXVlcnkgcGFyYW1ldGVyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBjb25zdCBpbXBvcnRTcGVjaWZpZXIgPSBgJHttb2R1bGVQYXRofT90PSR7dGltZXN0YW1wfWA7XG5cbiAgLy8gSW1wb3J0IHRoZSBtb2R1bGUgZnJlc2hcbiAgcmV0dXJuIGF3YWl0IGltcG9ydChpbXBvcnRTcGVjaWZpZXIpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9nZXRCdXR0ZXJ5Q29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9nZXRCdXR0ZXJ5Q29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgTE9HIH0gZnJvbSBcIi4uL19sb2dnZXIvdXRpbC50cy5sb2dnZXIuanNcIjtcbmltcG9ydCB7IGJ1dHRlcnlDb25maWdEZWZhdWx0cyB9IGZyb20gXCIuL2J1dHRlcnktY29uZmlnLmRlZmF1bHRzLmpzXCI7XG5pbXBvcnQgdHlwZSB7XG4gIEJ1dHRlcnlDb25maWcsXG4gIEJ1dHRlcnlDb25maWdQYXRocyxcbiAgR2V0QnV0dGVyeUNvbmZpZ09wdGlvbnNcbn0gZnJvbSBcIi4vYnV0dGVyeS1jb25maWcudHlwZXMuanNcIjtcbmltcG9ydCB7IGVuc3VyZUJ1dHRlcnlTdG9yZSB9IGZyb20gXCIuL2Vuc3VyZUJ1dHRlcnlTdG9yZS5qc1wiO1xuaW1wb3J0IHsgZ2V0QnV0dGVyeUNvbmZpZ0ZpbGUgfSBmcm9tIFwiLi9nZXRCdXR0ZXJ5Q29uZmlnRmlsZS5qc1wiO1xuaW1wb3J0IHsgZ2V0QnV0dGVyeUNvbmZpZ01vZHVsZSB9IGZyb20gXCIuL2dldEJ1dHRlcnlDb25maWdNb2R1bGUuanNcIjtcblxudHlwZSBCdXR0ZXJ5Q29uZmlnV2l0aFBhdGhzID0ge1xuICBjb25maWc6IEJ1dHRlcnlDb25maWc7XG4gIHBhdGhzOiBCdXR0ZXJ5Q29uZmlnUGF0aHM7XG59O1xuXG5leHBvcnQgdHlwZSBHZXRCdXR0ZXJ5Q29uZmlnPE4gZXh0ZW5kcyBrZXlvZiBCdXR0ZXJ5Q29uZmlnIHwgdW5kZWZpbmVkPiA9XG4gIE4gZXh0ZW5kcyBrZXlvZiBCdXR0ZXJ5Q29uZmlnXG4gICAgPyBCdXR0ZXJ5Q29uZmlnV2l0aFBhdGhzICYge1xuICAgICAgICBbSyBpbiBOXTogUmVxdWlyZWQ8QnV0dGVyeUNvbmZpZz5bS107XG4gICAgICB9XG4gICAgOiBCdXR0ZXJ5Q29uZmlnV2l0aFBhdGhzO1xuXG5leHBvcnQgdHlwZSBSZXNvbHZlZEJ1dHRlcnlDb25maWc8VCBleHRlbmRzIGtleW9mIEJ1dHRlcnlDb25maWc+ID0gT21pdDxcbiAgR2V0QnV0dGVyeUNvbmZpZzxUPixcbiAgXCJjb25maWdcIlxuPjtcblxuLyoqXG4gKiBTZWFyY2hlcyBmb3IgdGhlIC5idXR0ZXJ5L2NvbmZpZyBmaWxlIGVpdGhlciBmcm9tIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5XG4gKiBvciBmcm9tIGEgcHJvdmlkZWQgZGlyZWN0b3J5LiBBdHRlbXB0cyB0byByZXNvbHZlIGEgZmV3IGRpcmVjdG9yaWVzIGFuZFxuICogY29uZmlndXJhdGlvbnMgYmFzZWQgdXBvbiB0aGF0IHNlYXJjaC4gT25jZSBmb3VuZCwgaXQgYnVpbGRzIHRoZSBjb25maWd1cmF0aW9uXG4gKiB1c2luZyBlc2J1aWxkIGFuZCB0aGVuIHJlc29sdmVzIHRoZSBjb25maWd1cmF0aW9uIGFzIGFuIEVTTW9kdWxlIHRvIGJlIHVzZWRcbiAqIGluIGFueSBvZiB0aGUgY29tbWFuZHMgaW4gdGhlIENMSS5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEJ1dHRlcnlDb25maWcgPSBhc3luYyA8VCBleHRlbmRzIGtleW9mIEJ1dHRlcnlDb25maWc+KFxuICBuZXN0ZWRDb25maWdLZXk6IFQsXG4gIG9wdGlvbnM/OiBHZXRCdXR0ZXJ5Q29uZmlnT3B0aW9uc1xuKTogUHJvbWlzZTxSZXNvbHZlZEJ1dHRlcnlDb25maWc8VD4+ID0+IHtcbiAgLy8gUmVzb2x2ZSB0aGUgb3B0aW9uc1xuICBjb25zdCBvcHRpb25Qcm9tcHQgPSBvcHRpb25zPy5wcm9tcHQgPz8gZmFsc2U7XG4gIGNvbnN0IG9wdGlvbldhdGNoID0gb3B0aW9ucz8ud2F0Y2ggPz8gZmFsc2U7XG4gIGNvbnN0IG9wdGlvbkRlZmF1bHRDb25maWcgPSBvcHRpb25zPy5kZWZhdWx0Q29uZmlnO1xuICBjb25zdCBvcHRpb25TdGFydGluZ0RpcmVjdG9yeSA9IG9wdGlvbnM/LnN0YXJ0aW5nRGlyZWN0b3J5O1xuICBjb25zdCBvcHRpb25SZXF1aXJlQ29uZmlnID0gb3B0aW9ucz8ucmVxdWlyZUNvbmZpZyA/PyB0cnVlO1xuXG4gIC8vIHNlYXJjaCBmb3IgdGhlIGNvbmZpZyBmaWxlIHN0YXJ0aW5nIHdpdGggYSBkaXJlY3Rvcnkgb3IgdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnlcbiAgY29uc3Qgc2VhcmNoRGlyZWN0b3J5ID0gb3B0aW9uU3RhcnRpbmdEaXJlY3RvcnkgPz8gcHJvY2Vzcy5jd2QoKTtcbiAgY29uc3QgYnV0dGVyeUNvbmZpZ0ZpbGUgPSBhd2FpdCBnZXRCdXR0ZXJ5Q29uZmlnRmlsZShzZWFyY2hEaXJlY3RvcnksIHtcbiAgICBwcm9tcHQ6IG9wdGlvblByb21wdCxcbiAgICBkZWZhdWx0Q29uZmlnOiBvcHRpb25EZWZhdWx0Q29uZmlnXG4gIH0pO1xuXG4gIC8vIGVuc3VyZSB0aGUgLmJ1dHRlcnkvLnN0b3JlIGRpcmVjdG9yeVxuICBjb25zdCBidXR0ZXJ5U3RvcmVEaXIgPSBhd2FpdCBlbnN1cmVCdXR0ZXJ5U3RvcmUoe1xuICAgIGJ1dHRlcnlEaXI6IGJ1dHRlcnlDb25maWdGaWxlLmRpcmVjdG9yeVxuICB9KTtcblxuICAvLyB0cmFuc3BpbGUgdGhlIGJ1aWxkIGFuZCBvcHRpb25hbGx5IHdhdGNoXG4gIGNvbnN0IGJ1dHRlcnlDb25maWdNb2R1bGUgPSBhd2FpdCBnZXRCdXR0ZXJ5Q29uZmlnTW9kdWxlKHtcbiAgICBidXR0ZXJ5Q29uZmlnRmlsZVBhdGg6IGJ1dHRlcnlDb25maWdGaWxlLnBhdGgsXG4gICAgYnV0dGVyeVN0b3JlRGlyZWN0b3J5UGF0aDogYnV0dGVyeVN0b3JlRGlyLFxuICAgIHdhdGNoOiBvcHRpb25XYXRjaFxuICB9KTtcblxuICBjb25zdCBidXR0ZXJ5Q29uZmlnOiBCdXR0ZXJ5Q29uZmlnV2l0aFBhdGhzID0ge1xuICAgIGNvbmZpZzogYnV0dGVyeUNvbmZpZ01vZHVsZSxcbiAgICBwYXRoczoge1xuICAgICAgY29uZmlnOiBidXR0ZXJ5Q29uZmlnRmlsZS5wYXRoLFxuICAgICAgc3RvcmVEaXI6IGJ1dHRlcnlTdG9yZURpcixcbiAgICAgIGJ1dHRlcnlEaXI6IGJ1dHRlcnlDb25maWdGaWxlLmRpcmVjdG9yeSxcbiAgICAgIHJvb3REaXI6IHBhdGguZGlybmFtZShidXR0ZXJ5Q29uZmlnRmlsZS5kaXJlY3RvcnkpXG4gICAgfVxuICB9O1xuXG4gIHRyeSB7XG4gICAgbGV0IG5lc3RlZENvbmZpZyA9IGJ1dHRlcnlDb25maWcuY29uZmlnW25lc3RlZENvbmZpZ0tleV07XG5cbiAgICBpZiAob3B0aW9uUmVxdWlyZUNvbmZpZykge1xuICAgICAgaWYgKCFuZXN0ZWRDb25maWcpIHtcbiAgICAgICAgdGhyb3cgYENhbm5vdCBmaW5kIHRoZSBcImJ1dHRlcnkuY29uZmlnLiR7bmVzdGVkQ29uZmlnS2V5fVwiIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBQbGVhc2UgZW5zdXJlIHRoYXQgdGhlIFwiJHtuZXN0ZWRDb25maWdLZXl9XCIgZXhpc3RzIGluIHlvdXIgXCJidXR0ZXJ5LmNvbmZpZ1wiLmA7XG4gICAgICB9XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhuZXN0ZWRDb25maWcpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBgXCJidXR0ZXJ5LmNvbmZpZy4ke25lc3RlZENvbmZpZ0tleX1cIiBjb25maWd1cmF0aW9uIG9iamVjdCBpcyBlbXB0eS4gUGxlYXNlIGVuc3VyZSB0aGF0IHRoZSBcIiR7bmVzdGVkQ29uZmlnS2V5fVwiIGhhcyB2YWx1ZXMgaW4geW91ciBcImJ1dHRlcnkuY29uZmlnXCIuYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmVzdGVkQ29uZmlnID0gYnV0dGVyeUNvbmZpZ0RlZmF1bHRzW25lc3RlZENvbmZpZ0tleV07XG4gICAgfVxuXG4gICAgY29uc3QgeyBjb25maWcsIC4uLnJlc3RDb25maWcgfSA9IGJ1dHRlcnlDb25maWc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ucmVzdENvbmZpZyxcbiAgICAgIFtuZXN0ZWRDb25maWdLZXldOiBuZXN0ZWRDb25maWdcbiAgICB9IGFzIE9taXQ8R2V0QnV0dGVyeUNvbmZpZzxUPiwgXCJjb25maWdcIj47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyID0gbmV3IEVycm9yKGVycm9yIGFzIHN0cmluZyk7XG4gICAgTE9HLmZhdGFsKGVycik7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9idXR0ZXJ5LWNvbmZpZy5kZWZhdWx0cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWcvYnV0dGVyeS1jb25maWcuZGVmYXVsdHMudHNcIjtpbXBvcnQgdHlwZSB7IEJ1dHRlcnlDb25maWcgfSBmcm9tIFwiLi9idXR0ZXJ5LWNvbmZpZy50eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5Q29uZmlnQ29tbWFuZHMgfSBmcm9tIFwiLi9idXR0ZXJ5LWNvbmZpZy50eXBlcy5jb21tYW5kc1wiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5Q29uZmlnRG9jcyB9IGZyb20gXCIuL2J1dHRlcnktY29uZmlnLnR5cGVzLmRvY3NcIjtcbmltcG9ydCB0eXBlIHsgQnV0dGVyeUNvbmZpZ0ljb25zIH0gZnJvbSBcIi4vYnV0dGVyeS1jb25maWcudHlwZXMuaWNvbnNcIjtcbmltcG9ydCB0eXBlIHsgQnV0dGVyeUNvbmZpZ1Rva2VucyB9IGZyb20gXCIuL2J1dHRlcnktY29uZmlnLnR5cGVzLnRva2Vuc1wiO1xuXG5jb25zdCBzeXN0ZW1Gb250ID0gYHN5c3RlbS11aSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiYDtcblxuZXhwb3J0IGNvbnN0IGJ1dHRlcnlDb25maWdEZWZhdWx0VG9rZW5zOiBCdXR0ZXJ5Q29uZmlnVG9rZW5zID0ge1xuICBuYW1lc3BhY2U6IFwicmFuZG9tXCIsXG4gIHByZWZpeDogXCJyYW5kb20tdG9rZW5zXCIsXG4gIHN0cmljdDogdHJ1ZSxcbiAgZ3JpZFN5c3RlbTogNCxcbiAgc3VwcHJlc3NTdHJpY3RXYXJuaW5nczogZmFsc2UsXG4gIGZvbnQ6IHtcbiAgICBzaXplOiAxNixcbiAgICBmYW1pbHk6IHtcbiAgICAgIGhlYWRpbmc6IHN5c3RlbUZvbnQsXG4gICAgICBib2R5OiBzeXN0ZW1Gb250XG4gICAgfSxcbiAgICB3ZWlnaHQ6IHtcbiAgICAgIGJvbGQ6IDcwMCxcbiAgICAgIFwic2VtaS1ib2xkXCI6IDYwMCxcbiAgICAgIG1lZGl1bTogNTAwLFxuICAgICAgcmVndWxhcjogNDAwLFxuICAgICAgbGlnaHQ6IDMwMFxuICAgIH0sXG4gICAgdHlwb2dyYXBoeToge1xuICAgICAgaGVhZGluZzE6IHtcbiAgICAgICAgZm9udEZhbWlseTogXCJoZWFkaW5nXCIsXG4gICAgICAgIGZvbnRTaXplOiA3NCxcbiAgICAgICAgbGluZUhlaWdodDogODJcbiAgICAgIH0sXG4gICAgICBoZWFkaW5nMjoge1xuICAgICAgICBmb250RmFtaWx5OiBcImhlYWRpbmdcIixcbiAgICAgICAgZm9udFNpemU6IDY0LFxuICAgICAgICBsaW5lSGVpZ2h0OiA3NFxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY29sb3I6IHtcbiAgICBicmFuZDoge1xuICAgICAgbW9kZTogXCJjYXRlZ29yeVwiLFxuICAgICAgdG9uZTogXCJmbHVvcmVzY2VudFwiLFxuICAgICAgYnJpZ2h0bmVzczogOTUsXG4gICAgICBzYXR1cmF0aW9uOiA4NCxcbiAgICAgIGh1ZXM6IHtcbiAgICAgICAgcHJpbWFyeTogMzIsXG4gICAgICAgIHNlY29uZGFyeTogODRcbiAgICAgIH0sXG4gICAgICB2YXJpYW50czoge1xuICAgICAgICBtb2RlOiBcImF1dG9cIixcbiAgICAgICAgbnVtT2ZWYXJpYW50czogMTBcbiAgICAgIH1cbiAgICB9LFxuICAgIHNoYWRlOiB7XG4gICAgICB2YWx1ZXM6IHtcbiAgICAgICAgbmV1dHJhbDogXCIjMDAwMDAwXCJcbiAgICAgIH0sXG4gICAgICB2YXJpYW50czoge1xuICAgICAgICBtb2RlOiBcImF1dG9cIixcbiAgICAgICAgbnVtT2ZWYXJpYW50czogMTBcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJyZWFrcG9pbnRzOiB7XG4gICAgcGhvbmU6IDM3NSxcbiAgICB0YWJsZXQ6IDc2OCxcbiAgICBkZXNrdG9wOiAxMjgwXG4gIH1cbn07XG5leHBvcnQgY29uc3QgYnV0dGVyeUNvbmZpZ0RlZmF1bHREb2NzOiBCdXR0ZXJ5Q29uZmlnRG9jcyA9IHtcbiAgYnVpbGRUYXJnZXQ6IFwiY2xvdWRmbGFyZS1wYWdlc1wiLFxuICByb3V0ZVN0cmF0ZWd5OiBcInNlY3Rpb24tZm9sZGVyc1wiXG59O1xuZXhwb3J0IGNvbnN0IGJ1dHRlcnlDb25maWdEZWZhdWx0Q29tbWFuZHM6IEJ1dHRlcnlDb25maWdDb21tYW5kcyA9IHtcbiAgbmFtZTogXCJyYW5kb21cIixcbiAgZGVzY3JpcHRpb246IFwiQSBDTEkgdGhhdCBuZWVkcyBhIGRlc2NyaXB0aW9uIC0gQ0hBTkdFIE1FXCIsXG4gIGNvbW1hbmRzRGlyOiBcImNvbW1hbmRzXCIsXG4gIHZlcnNpb246IFwiMC4wLjFcIlxufTtcbmV4cG9ydCBjb25zdCBidXR0ZXJ5Q29uZmlnRGVmYXVsdEljb25zOiBCdXR0ZXJ5Q29uZmlnSWNvbnMgPSB7XG4gIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICBvdXREaXI6IHVuZGVmaW5lZCxcbiAgc3ZnRGlyOiB1bmRlZmluZWRcbn07XG5cbmV4cG9ydCBjb25zdCBidXR0ZXJ5Q29uZmlnRGVmYXVsdHM6IFJlcXVpcmVkPEJ1dHRlcnlDb25maWc+ID0ge1xuICB0b2tlbnM6IGJ1dHRlcnlDb25maWdEZWZhdWx0VG9rZW5zLFxuICBkb2NzOiBidXR0ZXJ5Q29uZmlnRGVmYXVsdERvY3MsXG4gIGNvbW1hbmRzOiBidXR0ZXJ5Q29uZmlnRGVmYXVsdENvbW1hbmRzLFxuICBpY29uczogYnV0dGVyeUNvbmZpZ0RlZmF1bHRJY29uc1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWcvZW5zdXJlQnV0dGVyeVN0b3JlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9lbnN1cmVCdXR0ZXJ5U3RvcmUudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBlbnN1cmVEaXIgfSBmcm9tIFwiZnMtZXh0cmFcIjtcbmltcG9ydCB7IExPRyB9IGZyb20gXCIuLi9fbG9nZ2VyL3V0aWwudHMubG9nZ2VyXCI7XG5pbXBvcnQgeyBlbnN1cmVHaXRJZ25vcmVFbnRyeSB9IGZyb20gXCIuL2Vuc3VyZUdpdGlnbm9yZUVudHJ5XCI7XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IHRoZSBgLy5idXR0ZXJ5Ly5zdG9yZWAgZXhpc3RzLiBJZiB0aGVyZSBpcyBpc3N1ZXMgZW5zdXJpbmdcbiAqIHRoZSBkaXJlY3RvcnkgaXQgd2lsbCBzdG9yZS4gSW4gYWRkaXRpb24gaXQgd2lsbCBhbHNvIGVuc3VyZSBzb21lIGVudGlyZXNcbiAqIGluIHRoZSAuZ2l0aWdub3JlIGZpbGVcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSByZXNvbHZlZCBmaWxlcGF0aFxuICogb2YgdGhlIGAvLmJ1dHRlcnkvLnN0b3JlYC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUJ1dHRlcnlTdG9yZShvcHRpb25zOiB7IGJ1dHRlcnlEaXI6IHN0cmluZyB9KSB7XG4gIGNvbnN0IGJ1dHRlcnlTdG9yZURpciA9IHBhdGgucmVzb2x2ZShvcHRpb25zLmJ1dHRlcnlEaXIsIFwiLi8uc3RvcmVcIik7XG5cbiAgLy8gZW5zdXJlIGFuIGVudHJ5IGluIHRoZSAuZ2l0aWdub3JlXG4gIGF3YWl0IGVuc3VyZUdpdElnbm9yZUVudHJ5KFwiLnN0b3JlXCIsIHsgYnV0dGVyeURpcjogb3B0aW9ucy5idXR0ZXJ5RGlyIH0pO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgZW5zdXJlRGlyKGJ1dHRlcnlTdG9yZURpcik7XG4gICAgcmV0dXJuIGJ1dHRlcnlTdG9yZURpcjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBMT0cuZmF0YWwoXG4gICAgICBuZXcgRXJyb3IoYEZhdGFsIGVycm9yIHdoZW4gcmVzb2x2aW5nIHRoZSAuYnV0dGVyeS8uc3RvcmU6ICR7ZXJyb3J9YClcbiAgICApO1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnL2Vuc3VyZUdpdGlnbm9yZUVudHJ5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9lbnN1cmVHaXRpZ25vcmVFbnRyeS50c1wiO2ltcG9ydCB7IGFwcGVuZEZpbGUsIHJlYWRGaWxlIH0gZnJvbSBcIm5vZGU6ZnMvcHJvbWlzZXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGVuc3VyZUZpbGUgfSBmcm9tIFwiZnMtZXh0cmFcIjtcbmltcG9ydCB7IExPRyB9IGZyb20gXCIuLi9fbG9nZ2VyL3V0aWwudHMubG9nZ2VyXCI7XG5cbi8qKlxuICogQWRkcyBhbiBlbnRyeSB0byB0aGUgLmdpdGlnbm9yZSBmaWxlIGluIHRoZSAuYnV0dGVyeSBkaXJlY3RvcnkgaWZcbiAqIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC4gSWYgdGhlIC5naXRpZ25vcmUgZmlsZSBkb2Vzbid0IGV4aXN0LCB0aGlzXG4gKiBmdW5jdGlvbiB3aWxsIGNyZWF0ZSBpdC5cbiAqXG4gKiBUaGlzIGlzIGhlbHBmdWwgaWYgdGhyb3VnaG91dCB0aGUgY29uZmlnIHJlc29sdXRpb24gYW5kIHRyYW5zcGlsYXRpb24gcHJvY2Vzc1xuICogYSBmaWxlIG5lZWRzIHRvIGJlIGNyZWF0ZWQgdG8gYmUgcmVhZCBidXQgd2UgZG9uJ3Qgd2FudCB0byByZWx5IG9uIHRoZSB1c2VyXG4gKiB0byBtYW51YWxseSBhZGQgZW50aXJlcyB0byB0aGVpciBvd24gLmdpdGlnbm9yZSBmaWxlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5zdXJlR2l0SWdub3JlRW50cnkoXG4gIGVudHJ5OiBzdHJpbmcsXG4gIG9wdGlvbnM6IHsgYnV0dGVyeURpcjogc3RyaW5nIH1cbikge1xuICBjb25zdCByZXNvbHZlZEdpdElnbm9yZUZpbGUgPSBwYXRoLnJlc29sdmUoXG4gICAgb3B0aW9ucy5idXR0ZXJ5RGlyLFxuICAgIFwiLi8uZ2l0aWdub3JlXCJcbiAgKTtcblxuICB0cnkge1xuICAgIExPRy5kZWJ1ZyhcIkVuc3VyaW5nIC5idXR0ZXJ5Ly5naXRpZ25vcmUgZmlsZSBleGlzdHMuLi5cIik7XG4gICAgYXdhaXQgZW5zdXJlRmlsZShyZXNvbHZlZEdpdElnbm9yZUZpbGUpO1xuICAgIExPRy5kZWJ1ZyhcIkVuc3VyaW5nIC5idXR0ZXJ5Ly5naXRpZ25vcmUgZmlsZSBleGlzdHMuLi4gZG9uZVwiKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBMT0cuZmF0YWwoXG4gICAgICBuZXcgRXJyb3IoXG4gICAgICAgIGBGYXRhbCBlcnJvciB3aGVuIHRyeWluZyB0byBlbnN1cmUgdGhlIGV4aXN0ZW5jZSBvZiB0aGUgXFxgLmJ1dHRlcnkvLmdpdGlnbm9yZVxcYCBmaWxlOiAke2Vycm9yfWBcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBMT0cuZGVidWcoXCJDaGVja2luZyAuYnV0dGVyeS8uZ2l0aWdub3JlIGZvciBlbnRyeVwiLCB7IGVudHJ5IH0pO1xuICAgIGNvbnN0IGdpdElnbm9yZUNvbnRlbnRzID0gYXdhaXQgcmVhZEZpbGUocmVzb2x2ZWRHaXRJZ25vcmVGaWxlLCB7XG4gICAgICBlbmNvZGluZzogXCJ1dGY4XCJcbiAgICB9KTtcbiAgICBpZiAoZ2l0SWdub3JlQ29udGVudHMuaW5jbHVkZXMoZW50cnkpKSB7XG4gICAgICBMT0cuZGVidWcoXCJFbnRyeSBhbHJlYWR5IGV4aXN0cyBpbiAuL2J1dHRlcnkvLmdpdGlnbm9yZS4uLiBtb3Zpbmcgb24uXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdFbnRyeSA9IGBcXG4ke2VudHJ5fVxcbmA7XG4gICAgLy8gYXBwZW5kcyB0aGUgZW50cnkgb24gYSBuZXcgbGluZSBvZiB0aGUgLmdpdGlnbm9yZVxuICAgIExPRy5kZWJ1ZyhcbiAgICAgIFwiRW50cnkgZG9lcyBub3QgZXhpc3QgaW4gLi9idXR0ZXJ5Ly5naXRpZ25vcmUuIEFwcGVuZGluZyBmaWxlLi4uXCJcbiAgICApO1xuICAgIGF3YWl0IGFwcGVuZEZpbGUocmVzb2x2ZWRHaXRJZ25vcmVGaWxlLCBuZXdFbnRyeSwgeyBlbmNvZGluZzogXCJ1dGY4XCIgfSk7XG4gICAgTE9HLmRlYnVnKFxuICAgICAgXCJFbnRyeSBkb2VzIG5vdCBleGlzdCBpbiAuL2J1dHRlcnkvLmdpdGlnbm9yZS4gQXBwZW5kaW5nIGZpbGUuLi5cIlxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IExPRy5mYXRhbChcbiAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgYEZhdGFsIGVycm9yIHdoZW4gdHJ5aW5nIHRvIHJlYWQgYW5kIGFwcGVuZCB0aGUgXFxgLmJ1dHRlcnkvLmdpdGlnbm9yYWVcXGAgZmlsZTogJHtlcnJvcn1gXG4gICAgICApXG4gICAgKTtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9nZXRCdXR0ZXJ5Q29uZmlnRmlsZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWcvZ2V0QnV0dGVyeUNvbmZpZ0ZpbGUudHNcIjtpbXBvcnQgeyBleGlzdHNTeW5jLCBsc3RhdFN5bmMgfSBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tIFwibm9kZTpmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgTE9HIH0gZnJvbSBcIi4uL19sb2dnZXIvdXRpbC50cy5sb2dnZXIuanNcIjtcbmltcG9ydCB0eXBlIHsgR2V0QnV0dGVyeUNvbmZpZ09wdGlvbnMgfSBmcm9tIFwiLi9idXR0ZXJ5LWNvbmZpZy50eXBlcy5qc1wiO1xuaW1wb3J0IHtcbiAgY3JlYXRlRGVmYXVsdEJ1dHRlcnlDb25maWdBbmREaXJzLFxuICBwcm9tcHRVc2VyRm9yQnV0dGVyeUNvbmZpZ0RlZmF1bHRzLFxuICBwcm9tcHRVc2VyRm9yQnV0dGVyeURpckxvY2F0aW9uXG59IGZyb20gXCIuL2J1dHRlcnktY29uZmlnLnV0aWxzLmpzXCI7XG5cbi8qKlxuICogU3RhcnRzIGZyb20gYSBwcm92aWRlZCBzdGFydGluZyBhbmQgc2VhcmNoZXMgdXAgdGhlIGRpcmVjdG9yeSBzdHJ1Y3R1cmUgdG9cbiAqIGZpbmQgYSAuYnV0dGVyeS8gZGlyZWN0b3J5LCBhIC5jb25maWcgZmlsZSBpbnNpZGUgb2YgaXQgYW5kIHRoZW4gcmVzb2x2ZXMgdGhlIGNvbmZpZyBpZlxuICogaXMgcG9wdWxhdGVkIHdpdGggY29udGVudC4gQXQgYW55IHBvaW50IGluIHRpbWUgdGhlIG5lY2Vzc2FyeSBkaXJlY3RvcmllcywgZmlsZXMgb3IgZmlsZSByZXF1aXJlbWVudHNcbiAqIGFyZW4ndCBtZXQsIGl0IHdpbGwgdGhyb3cuXG4gKlxuICogSG93ZXZlciwgaWYgYSBgb3B0aW9uLnByb21wdGAgaXMgcGFzc2VkIGludG8gdGhlIGZ1bmN0aW9uLCB0aGUgZnVuY3Rpb24gd2lsbCB0aGVuIHByb21wdCB0aGVcbiAqIHVzZXIgZm9yIGFueSBtaXNzaW5nIGluZm9ybWF0aW9uIHRvIGVuc3VyZSB0aGUgbmVjZXNzYXJ5IGZpbGVzIGFyZSBjcmVhdGVkIGFuZCB0aGVuIHN1YnNlcXVlbnRseSB1c2VkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnV0dGVyeUNvbmZpZ0ZpbGUoXG4gIHN0YXJ0aW5nRGlyZWN0b3J5OiBzdHJpbmcsXG4gIG9wdGlvbnM/OiBHZXRCdXR0ZXJ5Q29uZmlnT3B0aW9uc1xuKSB7XG4gIC8vIFJlc29sdmUgdGhlIG9wdGlvbnMgdG8gdGhlaXIgZGVmYXVsdHNcbiAgY29uc3QgcHJvbXB0ID0gb3B0aW9ucz8ucHJvbXB0ID8/IGZhbHNlO1xuICBjb25zdCBkZWZhdWx0Q29uZmlnID0gb3B0aW9ucz8uZGVmYXVsdENvbmZpZztcblxuICAvLyBDaGVjayBmb3IgdGhlIGNvbmZpZyBmaWxlIGluIHRoZSAuYnV0dGVyeSBkaXJlY3RvcnlcbiAgbGV0IGJ1dHRlcnlEaXIgPSBnZXRCdXR0ZXJ5RGlyKHN0YXJ0aW5nRGlyZWN0b3J5KTtcblxuICAvLyBDcmVhdGUgYSBjb25maWcgZGlyZWN0b3J5IGFuZCBmaWxlIGJhc2VkIHVwb24gdGhlIGFuc3dlcnMgdGhhdCB0aGUgdXNlciBpcyBwcm9tcHRlZCBmb3JcbiAgaWYgKCFidXR0ZXJ5RGlyICYmIHByb21wdCkge1xuICAgIExPRy53YXJuaW5nKFxuICAgICAgXCJDYW5ub3QgbG9jYXRlIHRoZSBgLmJ1dHRlcnkvY29uZmlnYCBmaWxlIGluIHlvdXIgZmlsZSBzdHJ1Y3R1cmUuIExldCdzIGNyZWF0ZSBvbmUuXCJcbiAgICApO1xuICAgIGNvbnN0IHVzZXJCdXR0ZXJ5RGlyID1cbiAgICAgIGF3YWl0IHByb21wdFVzZXJGb3JCdXR0ZXJ5RGlyTG9jYXRpb24oc3RhcnRpbmdEaXJlY3RvcnkpO1xuICAgIGNvbnN0IHVzZXJCdXR0ZXJ5Q29uZmlnRGVmYXVsdHMgPSBhd2FpdCBwcm9tcHRVc2VyRm9yQnV0dGVyeUNvbmZpZ0RlZmF1bHRzKHtcbiAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IDEgb3IgbWFueSBjb25maWd1cmF0aW9ucyB5b3Ugd2lzaCB0byBkZWZhdWx0XCIsXG4gICAgICBkZWZhdWx0Q2hlY2tlZDogZGVmYXVsdENvbmZpZ1xuICAgIH0pO1xuICAgIC8vIHNldCB0aGUgYnV0dGVyeURpciB0byB0aGUgcGF0aCB0aGF0IHRoZSB1c2VyIGRlZmluZWRcbiAgICBidXR0ZXJ5RGlyID0gdXNlckJ1dHRlcnlEaXI7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGRlZmF1bHQgY29uZmlnXG4gICAgYXdhaXQgY3JlYXRlRGVmYXVsdEJ1dHRlcnlDb25maWdBbmREaXJzKFxuICAgICAgYnV0dGVyeURpcixcbiAgICAgIHVzZXJCdXR0ZXJ5Q29uZmlnRGVmYXVsdHNcbiAgICApO1xuICB9XG5cbiAgaWYgKCFidXR0ZXJ5RGlyKSB7XG4gICAgdGhyb3cgXCJDYW5ub3QgbG9jYXRlIHRoZSBgLmJ1dHRlcnkvY29uZmlnYCBmaWxlIGluIHlvdXIgZmlsZSBzdHJ1Y3R1cmUuIFBsZWFzZSBlbnN1cmUgeW91IGhhdmUgY3JlYXRlZCBvbmUuXCI7XG4gIH1cblxuICAvLyBDaGVjayBmb3IgdGhlIGNvbmZpZyBmaWxlIGluIHRoZSAuYnV0dGVyeSBkaXJlY3RvcnlcbiAgY29uc3QgY29uZmlnRmlsZVBhdGggPSBwYXRoLnJlc29sdmUoYnV0dGVyeURpciwgXCIuL2NvbmZpZy50c1wiKTtcbiAgbGV0IGRvZXNDb25maWdGaWxlRXhpc3QgPSBleGlzdHNTeW5jKGNvbmZpZ0ZpbGVQYXRoKTtcblxuICAvLyBDcmVhdGUgYSBjb25maWcgZmlsZSBiYXNlZCB1cG9uIHRoZSBhbnN3ZXJzIHRoYXQgdGhlIHVzZXIgaXMgcHJvbXB0ZWQgZm9yXG4gIGlmICghZG9lc0NvbmZpZ0ZpbGVFeGlzdCAmJiBwcm9tcHQpIHtcbiAgICBMT0cud2FybmluZyhcbiAgICAgIGBGb3VuZCB0aGUgLmJ1dHRlcnkgZGlyZWN0b3J5IGF0ICcke2J1dHRlcnlEaXJ9Jy4gSG93ZXZlciwgbm8gXFxgY29uZmlnLnRzXFxgIGZpbGUgaXMgcHJlc2VudC4gTGV0J3MgY3JlYXRlIG9uZS5gXG4gICAgKTtcbiAgICBjb25zdCB1c2VyRGVmaW5lZENvbmZpZ0RlZmF1bHRzID0gYXdhaXQgcHJvbXB0VXNlckZvckJ1dHRlcnlDb25maWdEZWZhdWx0cyh7XG4gICAgICBtZXNzYWdlOiBcIldoaWNoIGNvbmZpZ3VyYXRpb25zIHdvdWxkIHlvdSBsaWtlIHRvIGRlZmF1bHQ/XCIsXG4gICAgICBkZWZhdWx0Q2hlY2tlZDogZGVmYXVsdENvbmZpZ1xuICAgIH0pO1xuICAgIGF3YWl0IGNyZWF0ZURlZmF1bHRCdXR0ZXJ5Q29uZmlnQW5kRGlycyhcbiAgICAgIGJ1dHRlcnlEaXIsXG4gICAgICB1c2VyRGVmaW5lZENvbmZpZ0RlZmF1bHRzXG4gICAgKTtcbiAgICBkb2VzQ29uZmlnRmlsZUV4aXN0ID0gdHJ1ZTtcbiAgfVxuXG4gIGlmICghZG9lc0NvbmZpZ0ZpbGVFeGlzdCkge1xuICAgIHRocm93IGBGb3VuZCB0aGUgLmJ1dHRlcnkgZGlyZWN0b3J5IGF0ICcke2J1dHRlcnlEaXJ9Jy4gSG93ZXZlciwgbm8gXFxgY29uZmlnLnRzXFxgIGZpbGUgaXMgcHJlc2VudC4gUGxlYXNlIGFkZCBvbmUuYDtcbiAgfVxuXG4gIGxldCBmaWxlID0gYXdhaXQgcmVhZEZpbGUoY29uZmlnRmlsZVBhdGgpO1xuICBsZXQgaXNGaWxlRW1wdHkgPSBmaWxlLmxlbmd0aCA9PT0gMDtcblxuICAvLyBDcmVhdGUgYSBjb25maWcgZmlsZSBpZiB0aGUgY29uZmlnIGZpbGUgaXMgZW1wdHlcbiAgaWYgKGlzRmlsZUVtcHR5ICYmIHByb21wdCkge1xuICAgIExPRy53YXJuaW5nKFxuICAgICAgYEZvdW5kIFwiY29uZmlnLnRzXCIgZmlsZSBhdDogJyR7Y29uZmlnRmlsZVBhdGh9Jy4gSG93ZXZlciwgdGhpcyBmaWxlIGlzIGVtcHR5LiBMZXQncyBwb3B1bGF0ZSBpdC5gXG4gICAgKTtcbiAgICBjb25zdCB1c2VyRGVmaW5lZENvbmZpZ0RlZmF1bHRzID0gYXdhaXQgcHJvbXB0VXNlckZvckJ1dHRlcnlDb25maWdEZWZhdWx0cyh7XG4gICAgICBtZXNzYWdlOiBcIldoaWNoIGNvbmZpZ3VyYXRpb25zIHdvdWxkIHlvdSBsaWtlIHRvIGRlZmF1bHQ/XCIsXG4gICAgICBkZWZhdWx0Q2hlY2tlZDogZGVmYXVsdENvbmZpZ1xuICAgIH0pO1xuICAgIGF3YWl0IGNyZWF0ZURlZmF1bHRCdXR0ZXJ5Q29uZmlnQW5kRGlycyhcbiAgICAgIGJ1dHRlcnlEaXIsXG4gICAgICB1c2VyRGVmaW5lZENvbmZpZ0RlZmF1bHRzXG4gICAgKTtcbiAgICBmaWxlID0gYXdhaXQgcmVhZEZpbGUoY29uZmlnRmlsZVBhdGgpO1xuICAgIGlzRmlsZUVtcHR5ID0gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNGaWxlRW1wdHkpIHtcbiAgICB0aHJvdyBgRm91bmQgXCJjb25maWcudHNcIiBmaWxlIGF0OiAnJHtjb25maWdGaWxlUGF0aH0nLiBIb3dldmVyLCB0aGlzIGZpbGUgaXMgZW1wdHkuIFBsZWFzZSBhZGQgeW91ciBjb25maWcuYDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGF0aDogY29uZmlnRmlsZVBhdGgsXG4gICAgY29udGVudDogZmlsZSxcbiAgICBkaXJlY3Rvcnk6IGJ1dHRlcnlEaXJcbiAgfTtcbn1cblxuLyoqXG4gKiBSZWN1cnNpdmVseSBsb29rcyB1cCBmcm9tIHRoZSBjdXJyZW50IGRpcmVjdG9yeSB1cCB0aGUgdHJlZSB1bnRpbCB0aGUgcm9vdCBkaXJlY3RvcnlcbiAqIGZvciBhIGRpcmVjdG9yeSBjYWxsZWQgLmJ1dHRlcnlcbiAqIEBwYXJhbSBjdXJyZW50RGlyIC0gVGhlIGN1cnJlbnQgZGlyZWN0b3J5IHRvIHN0YXJ0IHNlYXJjaGluZyBmcm9tXG4gKiBAcmV0dXJucyBUaGUgcGF0aCB0byB0aGUgLmJ1dHRlcnkgZGlyZWN0b3J5IGlmIGZvdW5kLCBvdGhlcndpc2UgbnVsbFxuICovXG5mdW5jdGlvbiBnZXRCdXR0ZXJ5RGlyKGN1cnJlbnREaXI6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCB0YXJnZXREaXIgPSBcIi5idXR0ZXJ5XCI7XG4gIGNvbnN0IHJvb3REaXIgPSBwYXRoLnBhcnNlKGN1cnJlbnREaXIpLnJvb3Q7XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZSBmdW5jdGlvbiB0byB0cmF2ZXJzZSB1cCB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICogQHBhcmFtIGRpcmVjdG9yeSAtIFRoZSBkaXJlY3RvcnkgdG8gc3RhcnQgc2VhcmNoaW5nIGZyb21cbiAgICogQHJldHVybnMgVGhlIHBhdGggdG8gdGhlIC5idXR0ZXJ5IGRpcmVjdG9yeSBpZiBmb3VuZCwgb3RoZXJ3aXNlIG51bGxcbiAgICovXG4gIGZ1bmN0aW9uIHRyYXZlcnNlVXAoZGlyZWN0b3J5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCBwb3RlbnRpYWxQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgdGFyZ2V0RGlyKTtcbiAgICBpZiAoZXhpc3RzU3luYyhwb3RlbnRpYWxQYXRoKSAmJiBsc3RhdFN5bmMocG90ZW50aWFsUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgcmV0dXJuIHBvdGVudGlhbFBhdGg7XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudERpciA9IHBhdGguZGlybmFtZShkaXJlY3RvcnkpO1xuXG4gICAgaWYgKGRpcmVjdG9yeSA9PT0gcm9vdERpcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0cmF2ZXJzZVVwKHBhcmVudERpcik7XG4gIH1cblxuICBjb25zdCBidXR0ZXJ5RGlyID0gdHJhdmVyc2VVcChjdXJyZW50RGlyKTtcbiAgcmV0dXJuIGJ1dHRlcnlEaXI7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnL2J1dHRlcnktY29uZmlnLnV0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL19idXR0ZXJ5LWNvbmZpZy9idXR0ZXJ5LWNvbmZpZy51dGlscy50c1wiO2ltcG9ydCB7IG1rZGlyLCB3cml0ZUZpbGUgfSBmcm9tIFwibm9kZTpmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgY2hlY2tib3gsIGlucHV0IH0gZnJvbSBcIkBpbnF1aXJlci9wcm9tcHRzXCI7XG5pbXBvcnQgeyBleGhhdXN0aXZlTWF0Y2hHdWFyZCB9IGZyb20gXCIuLi8uLi8uLi91dGlscy90cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgYnV0dGVyeUNvbmZpZ0RlZmF1bHRzIH0gZnJvbSBcIi4vYnV0dGVyeS1jb25maWcuZGVmYXVsdHMuanNcIjtcbmltcG9ydCB0eXBlIHsgQnV0dGVyeUNvbmZpZyB9IGZyb20gXCIuL2J1dHRlcnktY29uZmlnLnR5cGVzLmpzXCI7XG5cbi8qKlxuICogQXNrcyB0aGUgdXNlciB0byBzZWxlY3Qgd2hpY2gga2V5cyBpbiB0aGUgYnV0dGVyeSBjb25maWdcbiAqIHNob3VsZCBjcmVhdGUgZGVmYXVsdHMgZm9yXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9tcHRVc2VyRm9yQnV0dGVyeUNvbmZpZ0RlZmF1bHRzKHtcbiAgbWVzc2FnZSxcbiAgZGVmYXVsdENoZWNrZWRcbn06IHtcbiAgbWVzc2FnZTogc3RyaW5nO1xuICBkZWZhdWx0Q2hlY2tlZDoga2V5b2YgQnV0dGVyeUNvbmZpZyB8IHVuZGVmaW5lZDtcbn0pOiBQcm9taXNlPChrZXlvZiBCdXR0ZXJ5Q29uZmlnKVtdPiB7XG4gIHJldHVybiBhd2FpdCBjaGVja2JveDxrZXlvZiBCdXR0ZXJ5Q29uZmlnPih7XG4gICAgbWVzc2FnZSxcbiAgICBjaG9pY2VzOiBPYmplY3Qua2V5cyhidXR0ZXJ5Q29uZmlnRGVmYXVsdHMpLm1hcCgoa2V5KSA9PiAoe1xuICAgICAgdmFsdWU6IGtleSBhcyBrZXlvZiBCdXR0ZXJ5Q29uZmlnLFxuICAgICAgY2hlY2tlZDoga2V5ID09PSBkZWZhdWx0Q2hlY2tlZFxuICAgIH0pKVxuICB9KTtcbn1cblxuLyoqXG4gKiBBc2tzIHRoZSB1c2VyIHRvIHdyaXRlIGEgbG9jYXRpb24gZm9yIHRoZSBwYXRoIG9mIHdoZXJlIHRoZSBidXR0ZXJ5IGRpcmVjdG9yeVxuICogc2hvdWxkIGJlIHBsYWNlZC4gUmV0dXJucyB0aGUgcmVzb2x2ZWQgLmJ1dHRlcnkvIGRpcmVjdG9yeS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb21wdFVzZXJGb3JCdXR0ZXJ5RGlyTG9jYXRpb24oXG4gIHN0YXJ0aW5nRGlyZWN0b3J5OiBzdHJpbmdcbikge1xuICBjb25zdCBiYXNlRGlyID0gYXdhaXQgaW5wdXQoe1xuICAgIG1lc3NhZ2U6IFwiSW4gd2hhdCBkaXJlY3Rvcnkgd291bGQgeW91IGxpa2UgdG8gY3JlYXRlIG9uZT9cIixcbiAgICBkZWZhdWx0OiBzdGFydGluZ0RpcmVjdG9yeVxuICB9KTtcbiAgY29uc3QgYnV0dGVyeURpciA9IHBhdGgucmVzb2x2ZShiYXNlRGlyLCBcIi4vLmJ1dHRlcnlcIik7XG4gIHJldHVybiBidXR0ZXJ5RGlyO1xufVxuXG4vKipcbiAqIFByb3ZpZGVkIGEgZGlyZWN0b3J5IGFuZCBhbiBhcnJheSBvZiBidXR0ZXJ5IGNvbmZpZ3VyYXRpb24ga2V5cyxcbiAqIHRoaXMgZnVuY3Rpb24gY3JlYXRlcyBhIGRlZmF1bHQgYnV0dGVyeSBjb25maWcgaW4gdGhlIGRpcmVjdG9yeVxuICogd2l0aCB0aGUgZGVmYXVsdHMgdGhhdCBtYXAgZGlyZWN0bHkgdG8gdGhlIHByb3ZpZGVkIGNvbmZpZyBrZXlzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVEZWZhdWx0QnV0dGVyeUNvbmZpZ0FuZERpcnMoXG4gIGJ1dHRlcnlEaXI6IHN0cmluZyxcbiAgY29uZmlnczogKGtleW9mIEJ1dHRlcnlDb25maWcpW11cbikge1xuICB0cnkge1xuICAgIC8vIGNyZWF0ZSB0aGUgbmVjZXNzYXJ5IGRpcnMgYW5kIGZpbGVzXG4gICAgLy8gY3JlYXRlcyB0aGUgYnV0dGVyeSBkaXIgYW5kIHRoZSBuZXN0ZWQgZGlycyBuZWVkZWQgdG9cbiAgICAvLyBzdG9yZSB0aGUgZmlsZXNcbiAgICBhd2FpdCBta2RpcihidXR0ZXJ5RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICBjb25zdCBjcmVhdGVCdXR0ZXJ5RGlycyA9IGNvbmZpZ3MucmVkdWNlPFByb21pc2U8dm9pZD5bXT4oXG4gICAgICAoYWNjdW0sIGNvbmZpZ0tleSkgPT4ge1xuICAgICAgICBjb25zdCBkaXJQYXRoID0gcGF0aC5yZXNvbHZlKGJ1dHRlcnlEaXIsIGAuLyR7Y29uZmlnS2V5fWApO1xuXG4gICAgICAgIHN3aXRjaCAoY29uZmlnS2V5KSB7XG4gICAgICAgICAgY2FzZSBcInRva2Vuc1wiOlxuICAgICAgICAgIGNhc2UgXCJpY29uc1wiOlxuICAgICAgICAgICAgcmV0dXJuIGFjY3VtO1xuXG4gICAgICAgICAgY2FzZSBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICAgIGNvbnN0IGZuID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBhd2FpdCBta2RpcihkaXJQYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gYWNjdW0uY29uY2F0KGZuKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgXCJkb2NzXCI6IHtcbiAgICAgICAgICAgIGNvbnN0IGZuID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBhd2FpdCBta2RpcihkaXJQYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgICBjb25zdCBpbmRleEZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpclBhdGgsIFwiLi9faW5kZXgubWRcIik7XG4gICAgICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZShcbiAgICAgICAgICAgICAgICBpbmRleEZpbGVQYXRoLFxuICAgICAgICAgICAgICAgIGAtLS1cbnRpdGxlOiBIb21lXG4tLS1cblxuIyBIb21lXFxuYFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBhY2N1bS5jb25jYXQoZm4oKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBleGhhdXN0aXZlTWF0Y2hHdWFyZChjb25maWdLZXkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgW11cbiAgICApO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKGNyZWF0ZUJ1dHRlcnlEaXJzKTtcblxuICAgIC8vIGNyZXRlIHRoZSBidXR0ZXJ5L2NvbmZpZyBjb250ZW50XG4gICAgY29uc3QgYnV0dGVyeUNvbmZpZ1BhdGggPSBwYXRoLnJlc29sdmUoYnV0dGVyeURpciwgXCIuL2NvbmZpZy50c1wiKTtcbiAgICBjb25zdCBjb25maWdKc29uID0gY29uZmlncy5yZWR1Y2UoXG4gICAgICAoYWNjdW0sIGNvbmZpZykgPT5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihhY2N1bSwge1xuICAgICAgICAgIFtjb25maWddOiBidXR0ZXJ5Q29uZmlnRGVmYXVsdHNbY29uZmlnXVxuICAgICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbiAgICBjb25zdCBidXR0ZXJ5Q29uZmlnQ29udGVudCA9IGBpbXBvcnQgdHlwZSB7IEJ1dHRlcnlDb25maWcgfSBmcm9tIFwiQGJ1dHRlcnkvY2xpXCJcbmNvbnN0IGNvbmZpZzogQnV0dGVyeUNvbmZpZyA9ICR7SlNPTi5zdHJpbmdpZnkoY29uZmlnSnNvbiwgbnVsbCwgMil9O1xuZXhwb3J0IGRlZmF1bHQgY29uZmlnXFxuYDtcblxuICAgIGF3YWl0IHdyaXRlRmlsZShidXR0ZXJ5Q29uZmlnUGF0aCwgYnV0dGVyeUNvbmZpZ0NvbnRlbnQsIHtcbiAgICAgIGVuY29kaW5nOiBcInV0ZjhcIlxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGBFcnJvciB3aGVuIHRyeWluZyB0byBjcmVhdGUgYSBkZWZhdWx0IC5idXR0ZXJ5L2NvbmZpZyBmaWxlOiAke2Vycm9yfWA7XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvX2J1dHRlcnktY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWcvZ2V0QnV0dGVyeUNvbmZpZ01vZHVsZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9fYnV0dGVyeS1jb25maWcvZ2V0QnV0dGVyeUNvbmZpZ01vZHVsZS50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCBlc2J1aWxkIGZyb20gXCJlc2J1aWxkXCI7XG5pbXBvcnQgdHNjb25maWdKc29uTGlicmFyeSBmcm9tIFwiLi4vLi4vLi4vdHNjb25maWcubGlicmFyeS5qc29uXCI7XG5pbXBvcnQgeyBkeW5hbWljSW1wb3J0IH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL25vZGUvdXRpbC5ub2RlLmR5bmFtaWMtaW1wb3J0XCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL3RzL3V0aWwudHMuaGFzaC1zdHJpbmdcIjtcbmltcG9ydCB7IExPRyB9IGZyb20gXCIuLi9fbG9nZ2VyL3V0aWwudHMubG9nZ2VyXCI7XG5pbXBvcnQgdHlwZSB7IEJ1dHRlcnlDb25maWcgfSBmcm9tIFwiLi9idXR0ZXJ5LWNvbmZpZy50eXBlc1wiO1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRCdXR0ZXJ5Q29uZmlnTW9kdWxlKFxuICBidXR0ZXJ5Q29uZmlnUGF0aDogc3RyaW5nXG4pOiBQcm9taXNlPEJ1dHRlcnlDb25maWc+IHtcbiAgdHJ5IHtcbiAgICBMT0cuZGVidWcoXCJJbXBvcnRpbmcgdHJhbnNwaWxlZCAnLmJ1dHRlcnkvY29uZmlnJyBmaWxlLi4uXCIpO1xuICAgIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGR5bmFtaWNJbXBvcnQoYnV0dGVyeUNvbmZpZ1BhdGgpO1xuICAgIExPRy5kZWJ1ZyhcIkltcG9ydGluZyB0cmFuc3BpbGVkICcuYnV0dGVyeS9jb25maWcnIGZpbGUuLi4gZG9uZS5cIik7XG4gICAgcmV0dXJuIG1vZHVsZS5kZWZhdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IExPRy5mYXRhbChcbiAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgYEZhdGFsIGVycm9yIHdoZW4gdHJ5aW5nIHRvIGltcG9ydCB0aGUgdHJhbnNwaWxlZCAnLmJ1dHRlcnkvY29uZmlnJzogJHtlcnJvcn1gXG4gICAgICApXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3ZpZGVkIHNvbWUgcmVzb2x2ZWQgcGF0aHMsIHRoaXMgZnVuY3Rpb24gd2lsbCBidWlsZCB0aGUgJy5idXR0ZXJ5L2NvbmZpZycgZmlsZVxuICogYW5kIHBsYWNlIGl0IGluIHRoZSAuYnV0dGVyeS8uc3RvcmUgZm9yIHJlLXVzZSBhcyB0aW1lIGdvZXMgb24uIElmIGEgd2F0Y2ggb3B0aW9uXG4gKiBpcyBwcm92aWRlZCwgaXQgd2lsbCB1c2Ugbm9kZW1vbiB0byBsaXN0ZW4gdG8gdGhlIGZpbGUgZm9yIGNoYW5nZXMgYW5kIHRoZW4gcmVidWlsZFxuICogdGhlIGZpbGUgdXNpbmcgRXNidWlsZCdzIFJlYnVpbGQgQVBJLlxuICpcbiAqIEZpbmFsbHksIHRoZSBmdW5jdGlvbiB3aWxsIGF0dGVtcHQgdG8gaW1wb3J0IGFuZCByZXR1cm4gdGhlIHJlc29sdmVkIGNvbmZpZyBhcyBhbiBFU01vZHVsZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEJ1dHRlcnlDb25maWdNb2R1bGUob3B0aW9uczoge1xuICBidXR0ZXJ5Q29uZmlnRmlsZVBhdGg6IHN0cmluZztcbiAgYnV0dGVyeVN0b3JlRGlyZWN0b3J5UGF0aDogc3RyaW5nO1xuICB3YXRjaD86IGJvb2xlYW47XG59KTogUHJvbWlzZTxCdXR0ZXJ5Q29uZmlnPiB7XG4gIGNvbnN0IGJ1aWx0Q29uZmlnT3V0RmlsZSA9IHBhdGgucmVzb2x2ZShcbiAgICBvcHRpb25zLmJ1dHRlcnlTdG9yZURpcmVjdG9yeVBhdGgsXG4gICAgYC4vY29uZmlnLyR7aGFzaFN0cmluZyhvcHRpb25zLmJ1dHRlcnlDb25maWdGaWxlUGF0aCl9LmpzYFxuICApO1xuXG4gIHRyeSB7XG4gICAgLy8gdXNlIHRoZSByZWJ1aWxkIEFQSSBzaW5jZSBhIGZpbGUgd2F0Y2hlciB3aWxsIGJlIGltcGxlbWVudGVkXG4gICAgLy8gdG8gcmUtY2FsbCB0aGlzIGZ1bmN0aW9uIHdoZW4gdGhpbmdzIGNoYW5nZSBpbiB0aGUgYXBwXG4gICAgY29uc3QgdHNjb25maWdSYXcgPSBKU09OLnN0cmluZ2lmeSh0c2NvbmZpZ0pzb25MaWJyYXJ5LCBudWxsLCAyKTtcbiAgICBjb25zdCBjb250ZXh0ID0gYXdhaXQgZXNidWlsZC5jb250ZXh0KHtcbiAgICAgIGVudHJ5UG9pbnRzOiBbb3B0aW9ucy5idXR0ZXJ5Q29uZmlnRmlsZVBhdGhdLFxuICAgICAgYnVuZGxlOiB0cnVlLFxuICAgICAgcGxhdGZvcm06IFwibm9kZVwiLFxuICAgICAgdGFyZ2V0OiBbXCJlc25leHRcIl0sXG4gICAgICBmb3JtYXQ6IFwiZXNtXCIsXG4gICAgICBvdXRmaWxlOiBidWlsdENvbmZpZ091dEZpbGUsXG4gICAgICBwYWNrYWdlczogXCJleHRlcm5hbFwiLFxuICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgdHNjb25maWdSYXdcbiAgICB9KTtcbiAgICBMT0cuZGVidWcoXCJUcmFuc3BpbGluZyB0aGUgJy5idXR0ZXJ5L2NvbmZpZycgZmlsZS4uLlwiKTtcbiAgICBhd2FpdCBjb250ZXh0LnJlYnVpbGQoKTtcbiAgICBMT0cuZGVidWcoXCJUcmFuc3BpbGluZyB0aGUgJy5idXR0ZXJ5L2NvbmZpZycgZmlsZS4uLiBkb25lLlwiKTtcbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCBpbXBvcnRCdXR0ZXJ5Q29uZmlnTW9kdWxlKGJ1aWx0Q29uZmlnT3V0RmlsZSk7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBMT0cuZmF0YWwoXG4gICAgICBuZXcgRXJyb3IoXG4gICAgICAgIGBGYXRhbCBlcnJvciB3aGVuIHRyeWluZyB0byB0cmFuc3BpbGUgYW5kIGJ1aWxkIHRoZSAnLmJ1dHRlcnkvY29uZmlnJyBmaWxlOiAke2Vycm9yfWBcbiAgICAgIClcbiAgICApO1xuICB9XG59XG4iLCAie1xuICBcImNvbXBpbGVyT3B0aW9uc1wiOiB7XG4gICAgXCJ0YXJnZXRcIjogXCJFU05leHRcIixcbiAgICBcInVzZURlZmluZUZvckNsYXNzRmllbGRzXCI6IHRydWUsXG4gICAgXCJtb2R1bGVcIjogXCJFU05leHRcIixcbiAgICBcImxpYlwiOiBbXCJFU05leHRcIl0sXG4gICAgXCJza2lwTGliQ2hlY2tcIjogdHJ1ZSxcbiAgICBcIm1vZHVsZVJlc29sdXRpb25cIjogXCJidW5kbGVyXCIsXG4gICAgXCJyZXNvbHZlSnNvbk1vZHVsZVwiOiB0cnVlLFxuICAgIFwiaXNvbGF0ZWRNb2R1bGVzXCI6IHRydWUsXG4gICAgXCJhbGxvd1N5bnRoZXRpY0RlZmF1bHRJbXBvcnRzXCI6IHRydWUsXG4gICAgXCJlc01vZHVsZUludGVyb3BcIjogdHJ1ZSxcbiAgICBcInN0cmljdFwiOiB0cnVlLFxuICAgIFwibm9VbnVzZWRMb2NhbHNcIjogdHJ1ZSxcbiAgICBcIm5vVW51c2VkUGFyYW1ldGVyc1wiOiB0cnVlLFxuICAgIFwibm9GYWxsdGhyb3VnaENhc2VzSW5Td2l0Y2hcIjogdHJ1ZSxcbiAgICBcIm5vRW1pdFwiOiB0cnVlLFxuICAgIFwiZGVjbGFyYXRpb25cIjogdHJ1ZSxcbiAgICBcImRlY2xhcmF0aW9uTWFwXCI6IHRydWUsXG4gICAgXCJqc3hcIjogXCJyZWFjdC1qc3hcIlxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzL3V0aWxzL3RzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy91dGlscy90cy91dGlsLnRzLmhhc2gtc3RyaW5nLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzL3V0aWxzL3RzL3V0aWwudHMuaGFzaC1zdHJpbmcudHNcIjtpbXBvcnQgeyBjcmVhdGVIYXNoIH0gZnJvbSBcIm5vZGU6Y3J5cHRvXCI7XG5cbi8qKlxuICogVGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBoYXNoZWQgcmVwcmVzZW50YXRpb25cbiAqIG9mIHRoYXQgc3RyaW5nLiBUaGlzIGlzIGRvbmUgdG8gcHJvdmlkZSBhIHNpZ25pZmljYW50bHlcbiAqIHVuaXF1ZSB0ZW1wIGRpcmVjdG9yeSBmb3Igc2VydmluZyB0aGUgbG9jYWwgZG9jcyBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBoYXNoU3RyaW5nID0gKGlucHV0OiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIGNyZWF0ZUhhc2goXCJzaGEyNTZcIikudXBkYXRlKGlucHV0KS5kaWdlc3QoXCJoZXhcIik7XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MuZ2V0QnV0dGVyeURvY3NDb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLmdldEJ1dHRlcnlEb2NzQ29uZmlnLnRzXCI7aW1wb3J0IHtcbiAgdHlwZSBHZXRCdXR0ZXJ5Q29uZmlnT3B0aW9ucyxcbiAgZ2V0QnV0dGVyeUNvbmZpZ1xufSBmcm9tIFwiLi4vX2J1dHRlcnktY29uZmlnL2luZGV4LmpzXCI7XG5cbmV4cG9ydCB0eXBlIEJ1dHRlcnlEb2NzQ29uZmlnID0gQXdhaXRlZDxcbiAgUmV0dXJuVHlwZTx0eXBlb2YgZ2V0QnV0dGVyeURvY3NDb25maWc+XG4+O1xuXG4vKipcbiAqIEZldGNoZXMgdGhlIGJ1dHRlcnkuZG9jcyBjb25maWcgZnJvbSB0aGVcbiAqIGBidXR0ZXJ5LmNvbmZpZy50c2AgZmlsZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnV0dGVyeURvY3NDb25maWcob3B0aW9ucz86IEdldEJ1dHRlcnlDb25maWdPcHRpb25zKSB7XG4gIHJldHVybiBhd2FpdCBnZXRCdXR0ZXJ5Q29uZmlnKFwiZG9jc1wiLCB7XG4gICAgLi4ub3B0aW9ucyxcbiAgICBkZWZhdWx0Q29uZmlnOiBcImRvY3NcIlxuICB9KTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlTURYRmlsZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MucGFyc2VNRFhGaWxlLnRzXCI7aW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tIFwibm9kZTpmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IG1hdHRlciBmcm9tIFwiZ3JheS1tYXR0ZXJcIjtcbmltcG9ydCB7IExPRyB9IGZyb20gXCIuLi9fbG9nZ2VyXCI7XG5pbXBvcnQgeyBwYXJzZU1EWEZpbGVDb250ZW50IH0gZnJvbSBcIi4vZG9jcy5wYXJzZU1EWEZpbGVDb250ZW50XCI7XG5pbXBvcnQgeyBwYXJzZU1EWEZpbGVGcm9udG1hdHRlciB9IGZyb20gXCIuL2RvY3MucGFyc2VNRFhGaWxlRnJvbnRtYXR0ZXJcIjtcbmltcG9ydCB7IHBhcnNlTURYRmlsZU5hbWUgfSBmcm9tIFwiLi9kb2NzLnBhcnNlTURYRmlsZW5hbWVcIjtcbmltcG9ydCB0eXBlIHsgQnV0dGVyeURvY3NHcmFwaEZyb250bWF0dGVyLCBGaWxlT2JqIH0gZnJvbSBcIi4vZG9jcy50eXBlc1wiO1xuXG5leHBvcnQgY29uc3QgcGFyc2VNZHhGaWxlID0gYXN5bmMgKHtcbiAgZmlsZW5hbWUsXG4gIGZzUGF0aCxcbiAgcm91dGVQYXRoXG59OiBGaWxlT2JqKSA9PiB7XG4gIExPRy5kZWJ1ZyhcIlBhcnNpbmcgTURYIGZpbGUuLi5cIiwgeyBmaWxlbmFtZSB9KTtcbiAgdHJ5IHtcbiAgICAvLyBwYXJzZSB0aGUgZnJvbnRtYXR0ZXIgYXdheSBmcm9tIHRoZSBtYXJrZG93biBjb250ZW50XG4gICAgY29uc3QgcmF3TWR4Q29udGVudCA9IGF3YWl0IHJlYWRGaWxlKGZzUGF0aCwgeyBlbmNvZGluZzogXCJ1dGY4XCIgfSk7XG4gICAgY29uc3QgeyBkYXRhLCBjb250ZW50OiBtZHhDb250ZW50IH0gPSBtYXR0ZXIocmF3TWR4Q29udGVudCk7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBkYXRhIGFzIEJ1dHRlcnlEb2NzR3JhcGhGcm9udG1hdHRlcjtcblxuICAgIC8vIHBhcnNlIHRoZSBmcm9udG1hdHRlclxuICAgIGNvbnN0IG1ldGEgPSBhd2FpdCBwYXJzZU1EWEZpbGVGcm9udG1hdHRlcih7IGZyb250bWF0dGVyLCBmaWxlbmFtZSB9KTtcblxuICAgIC8vIHBhcnNlIHRoZSBjb250ZW50XG4gICAgY29uc3QgeyB0b2MgfSA9IHBhcnNlTURYRmlsZUNvbnRlbnQobWR4Q29udGVudCk7XG5cbiAgICAvLyBwYXJzZSB0aGUgbmFtZSBvZiB0aGUgZmlsZVxuICAgIGNvbnN0IHsgc2VnbWVudHMsIHNlY3Rpb24gfSA9IHBhcnNlTURYRmlsZU5hbWUoZmlsZW5hbWUpO1xuICAgIExPRy5kZWJ1ZyhcIlBhcnNpbmcgTURYIGZpbGUuLi4gZG9uZS5cIiwgeyBmaWxlbmFtZSB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBmc1BhdGgsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGV4dDogcGF0aC5leHRuYW1lKGZzUGF0aCksXG4gICAgICB0b2MsXG4gICAgICBtZXRhLFxuICAgICAgc2VjdGlvbixcbiAgICAgIHJvdXRlQWJzOiByb3V0ZVBhdGgsXG4gICAgICBzZWdtZW50c1xuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgTE9HLmVycm9yKFwiRXJyb3Igd2hlbiB0cnlpbmcgdG8gcGFyc2UgdGhlIE1EWCBmaWxlLlwiKTtcbiAgICB0aHJvdyBMT0cuZmF0YWwobmV3IEVycm9yKGVycm9yIGFzIHN0cmluZykpO1xuICB9XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MucGFyc2VNRFhGaWxlQ29udGVudC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MucGFyc2VNRFhGaWxlQ29udGVudC50c1wiO2ltcG9ydCByZWh5cGVQYXJzZSBmcm9tIFwicmVoeXBlLXBhcnNlXCI7XG5pbXBvcnQgcmVoeXBlU2x1ZyBmcm9tIFwicmVoeXBlLXNsdWdcIjtcbmltcG9ydCByZWh5cGVTdHJpbmdpZnkgZnJvbSBcInJlaHlwZS1zdHJpbmdpZnlcIjtcbmltcG9ydCByZW1hcmtNZHggZnJvbSBcInJlbWFyay1tZHhcIjtcbmltcG9ydCByZW1hcmtQYXJzZSBmcm9tIFwicmVtYXJrLXBhcnNlXCI7XG5pbXBvcnQgcmVtYXJrUmVoeXBlIGZyb20gXCJyZW1hcmstcmVoeXBlXCI7XG5pbXBvcnQgeyB1bmlmaWVkIH0gZnJvbSBcInVuaWZpZWRcIjtcbmltcG9ydCB7IHZpc2l0IH0gZnJvbSBcInVuaXN0LXV0aWwtdmlzaXRcIjtcbmltcG9ydCB0eXBlIHsgQnV0dGVyeURvY3NHcmFwaFRPQyB9IGZyb20gXCIuL2RvY3MudHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTURYRmlsZUNvbnRlbnQobWFya2Rvd25Db250ZW50OiBzdHJpbmcpIHtcbiAgY29uc3QgZmlsZSA9IHVuaWZpZWQoKVxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVGhlcmUncyBzb21lIHdlaXJkIG1pc21hdGNoIGJldHdlZW4gdHlwZXNcbiAgICAudXNlKHJlbWFya1BhcnNlKVxuICAgIC51c2UocmVtYXJrTWR4KVxuICAgIC51c2UocmVtYXJrUmVoeXBlKVxuICAgIC51c2UocmVoeXBlU2x1ZylcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRoZXJlJ3Mgc29tZSB3ZWlyZCBtaXNtYXRjaCBiZXR3ZWVuIHR5cGVzXG4gICAgLnVzZShyZWh5cGVTdHJpbmdpZnkpXG4gICAgLnByb2Nlc3NTeW5jKG1hcmtkb3duQ29udGVudCk7XG4gIGNvbnN0IHRyZWUgPSB1bmlmaWVkKClcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRoZXJlJ3Mgc29tZSB3ZWlyZCBtaXNtYXRjaCBiZXR3ZWVuIHR5cGVzXG4gICAgLnVzZShyZWh5cGVQYXJzZSwgeyBmcmFnbWVudDogdHJ1ZSB9KVxuICAgIC5wYXJzZShmaWxlLnRvU3RyaW5nKCkpO1xuXG4gIGNvbnN0IHRvYzogQnV0dGVyeURvY3NHcmFwaFRPQ1tdID0gW107XG4gIGNvbnN0IHN0YWNrOiBCdXR0ZXJ5RG9jc0dyYXBoVE9DW10gPSBbXTtcblxuICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vRXhwbGljaXRBbnk6IDxleHBsYW5hdGlvbj5cbiAgdmlzaXQodHJlZSwgXCJlbGVtZW50XCIsIChub2RlOiBhbnkpID0+IHtcbiAgICBpZiAoXG4gICAgICBub2RlLnRhZ05hbWUubWF0Y2goL15oWzItM10kLykgJiZcbiAgICAgIG5vZGUucHJvcGVydGllcyAmJlxuICAgICAgbm9kZS5wcm9wZXJ0aWVzLmlkXG4gICAgKSB7XG4gICAgICBjb25zdCBsZXZlbCA9IE51bWJlci5wYXJzZUludChub2RlLnRhZ05hbWVbMV0sIDEwKTtcbiAgICAgIGNvbnN0IHRpdGxlID0gbm9kZS5jaGlsZHJlblxuICAgICAgICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vRXhwbGljaXRBbnk6IDxleHBsYW5hdGlvbj5cbiAgICAgICAgLm1hcCgoY2hpbGQ6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcInRleHRcIikgcmV0dXJuIGNoaWxkLnZhbHVlO1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImgxXCIpIHJldHVybiBcIlwiO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNoaWxkLnR5cGUgPT09IFwiZWxlbWVudFwiICYmXG4gICAgICAgICAgICAoY2hpbGQudGFnTmFtZSA9PT0gXCJhXCIgfHwgY2hpbGQudGFnTmFtZSA9PT0gXCJjb2RlXCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vRXhwbGljaXRBbnk6IDxleHBsYW5hdGlvbj5cbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5jaGlsZHJlbi5tYXAoKGFDaGlsZDogYW55KSA9PiBhQ2hpbGQudmFsdWUpLmpvaW4oXCJcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9KVxuICAgICAgICAuam9pbihcIlwiKTtcbiAgICAgIGNvbnN0IGxpbmsgPSBgIyR7bm9kZS5wcm9wZXJ0aWVzLmlkfWA7XG4gICAgICBjb25zdCBoZWFkZXJJdGVtOiBCdXR0ZXJ5RG9jc0dyYXBoVE9DID0ge1xuICAgICAgICBsZXZlbCxcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGxpbmssXG4gICAgICAgIGNoaWxkcmVuOiBbXVxuICAgICAgfTtcblxuICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5sZXZlbCA+PSBsZXZlbCkge1xuICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5jaGlsZHJlbi5wdXNoKGhlYWRlckl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9jLnB1c2goaGVhZGVySXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHN0YWNrLnB1c2goaGVhZGVySXRlbSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4geyB0b2MgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlRmlsZW5hbWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlRmlsZW5hbWUudHNcIjtleHBvcnQgZnVuY3Rpb24gcGFyc2VGaWxlbmFtZShmaWxlbmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IGZpbGVuYW1lQXJyID0gZmlsZW5hbWUuc3BsaXQoXCIuXCIpO1xuICBjb25zdCBzZWN0aW9uID0gZmlsZW5hbWVBcnJbMF07XG4gIGNvbnN0IHJvdXRlID0gZmlsZW5hbWVBcnIuc3BsaWNlKDEpLmpvaW4oXCIuXCIpO1xuICByZXR1cm4ge1xuICAgIHNlY3Rpb24sXG4gICAgcm91dGU6IHJvdXRlID09PSBcIlwiID8gc2VjdGlvbiA6IHJvdXRlLFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MucGFyc2VNRFhGaWxlRnJvbnRtYXR0ZXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlTURYRmlsZUZyb250bWF0dGVyLnRzXCI7aW1wb3J0IHsgTE9HIH0gZnJvbSBcIi4uL19sb2dnZXIvdXRpbC50cy5sb2dnZXJcIjtcbmltcG9ydCB7IHBhcnNlRmlsZW5hbWUgfSBmcm9tIFwiLi9kb2NzLnBhcnNlRmlsZW5hbWVcIjtcbmltcG9ydCB0eXBlIHsgQnV0dGVyeURvY3NHcmFwaEZyb250bWF0dGVyIH0gZnJvbSBcIi4vZG9jcy50eXBlc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGFyc2VNRFhGaWxlRnJvbnRtYXR0ZXIoe1xuICBmcm9udG1hdHRlcixcbiAgZmlsZW5hbWVcbn06IHtcbiAgZnJvbnRtYXR0ZXI6IEJ1dHRlcnlEb2NzR3JhcGhGcm9udG1hdHRlcjtcbiAgZmlsZW5hbWU6IHN0cmluZztcbn0pOiBQcm9taXNlPEJ1dHRlcnlEb2NzR3JhcGhGcm9udG1hdHRlcj4ge1xuICBjb25zdCB7IHJvdXRlIH0gPSBwYXJzZUZpbGVuYW1lKGZpbGVuYW1lKTtcblxuICAvLyBnZXQgdGhlIGZpbGVcbiAgaWYgKCFmcm9udG1hdHRlci50aXRsZSkge1xuICAgIExPRy53YXJuaW5nKFxuICAgICAgYFwiJHtmaWxlbmFtZX1cIiBpcyBtaXNzaW5nIGEgZnJvbnRtYXR0ZXIgXCJ0aXRsZVwiLiBcIiR7cm91dGV9XCIgd2lsbCBiZSB1c2VkIHRlbXBvcmFyaWx5LiBQbGVhc2UgZW5zdXJlIHlvdSBhZGQgdGhlIHRpdGxlIHByb3BlcnR5IGluIHRoZSBkb2N1bWVudCdzIGZyb250bWF0dGVyLmBcbiAgICApO1xuICB9XG5cbiAgaWYgKCFmcm9udG1hdHRlci5tZXRhKSB7XG4gICAgTE9HLndhcm5pbmcoXG4gICAgICBgXCIke2ZpbGVuYW1lfVwiIGlzIG1pc3NpbmcgYSBmcm9udG1hdHRlciBcIm1ldGFcIi4gVGhlIHJvdXRlIHdpbGwgbm90IGNvbnRhaW4gYW55IHBhZ2UgbWV0YSBpbmZvcm1hdGlvbiB3aGljaCB3aWxsIGltcGFjdCBTRU8uIFBsZWFzZSBhZGQgbWV0YSBjb250ZW50LmBcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0aXRsZTogZnJvbnRtYXR0ZXI/LnRpdGxlID8/IHJvdXRlLFxuICAgIG1ldGE6IGZyb250bWF0dGVyLm1ldGEgPz8gW11cbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlTURYRmlsZW5hbWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnBhcnNlTURYRmlsZW5hbWUudHNcIjtleHBvcnQgY29uc3QgcGFyc2VNRFhGaWxlTmFtZSA9IChcbiAgZmlsZU5hbWU6IHN0cmluZ1xuKTogeyBzZWN0aW9uOiBzdHJpbmc7IHNlZ21lbnRzOiBzdHJpbmdbXSB9ID0+IHtcbiAgY29uc3QgYWxsU2VnbWVudHMgPSBmaWxlTmFtZS5zcGxpdChcIi5cIik7XG4gIGNvbnN0IFtzZWN0aW9uLCAuLi5zZWdtZW50c10gPSBhbGxTZWdtZW50cztcblxuICByZXR1cm4ge1xuICAgIHNlY3Rpb24sXG4gICAgc2VnbWVudHMsXG4gIH07XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MuZ2V0QnV0dGVyeURvY3NHcmFwaC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MuZ2V0QnV0dGVyeURvY3NHcmFwaC50c1wiO2ltcG9ydCB7IExPRyB9IGZyb20gXCIuLi9fbG9nZ2VyL3V0aWwudHMubG9nZ2VyXCI7XG5pbXBvcnQgdHlwZSB7IEJ1dHRlcnlEb2NzQ29uZmlnIH0gZnJvbSBcIi4vZG9jcy5nZXRCdXR0ZXJ5RG9jc0NvbmZpZ1wiO1xuXG5pbXBvcnQgeyBwYXJzZU1keEZpbGUgfSBmcm9tIFwiLi9kb2NzLnBhcnNlTURYRmlsZVwiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5RG9jc0dyYXBoLCBGaWxlT2JqIH0gZnJvbSBcIi4vZG9jcy50eXBlc1wiO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBncmFwaC9vYmplY3QgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRoZSBmaWxlc1xuICogY29udGFpbmVkIGluc2lkZSBvZiB0aGUgZG9jcyBkaXJlY3RvcnkgdGhhdCBpcyByZWZlcmVuY2VkXG4gKiBpbiB0aGUgYGJ1dHRlcnkuY29uZmlnLnRzYCBmaWxlLiBUaGlzIGdyYXBoIGlzIGEgcmVjdXJzaXZlIHJlcHJlc2VudGF0aW9uXG4gKiBvZiB0aGUgZmlsZXMgYW5kIGNhbiB0aGVuIGJlIHJlY3Vyc2VkIHRocm91Z2ggdG8gYnVpbGQgcm91dGVzLCBuYXZpZ2F0aW9uYWxcbiAqIGl0ZW1zLCBldGMuLi4gVGhpbmsgb2YgaXQgbGlrZSBhbiBBU1QgYnV0IG9ubHkgZm9yIHRoZSBkb2NzIHRoYXQgYXJlIGRlZmluZWRcbiAqIGluIHRoZSBmb2xkZXIgdGhhdCB0aGUgdXNlciBzcGVjaWZpZWQgaW4gdGhlaXIgYGJ1dHRlcnkuY29uZmlnLnRzYC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEJ1dHRlcnlEb2NzR3JhcGgoXG4gIGNvbmZpZzogQnV0dGVyeURvY3NDb25maWcsXG4gIG9yZGVyZWRGaWxlczogRmlsZU9ialtdXG4pOiBQcm9taXNlPEJ1dHRlcnlEb2NzR3JhcGg+IHtcbiAgTE9HLmRlYnVnKFwiR2VuZXJhdGluZyBncmFwaCByZXByZXNlbnRhdGlvbiBvZiBkb2NzLi4uXCIpO1xuICBjb25zdCBncmFwaDogQnV0dGVyeURvY3NHcmFwaCA9IHt9O1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGluc2VydE5vZGUoZmlsZTogRmlsZU9iaikge1xuICAgIGNvbnN0IHBhcnNlZEZpbGUgPSBhd2FpdCBwYXJzZU1keEZpbGUoZmlsZSk7XG4gICAgaWYgKCFwYXJzZWRGaWxlKSByZXR1cm47XG4gICAgY29uc3Qge1xuICAgICAgbWV0YTogeyB0aXRsZSwgbWV0YSB9LFxuICAgICAgc2VjdGlvbixcbiAgICAgIHNlZ21lbnRzLFxuICAgICAgZXh0LFxuICAgICAgcm91dGVBYnMsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIHRvY1xuICAgIH0gPSBwYXJzZWRGaWxlO1xuXG4gICAgY29uc3Qgc2VjdGlvblRpdGxlID1cbiAgICAgIGNvbmZpZy5kb2NzPy5vcmRlcj8uW3NlY3Rpb25dPy5kaXNwbGF5ID8/IHNlY3Rpb24ucmVwbGFjZSgvLS9nLCBcIiBcIik7XG5cbiAgICBpZiAoc2VjdGlvbiAmJiAhZ3JhcGhbc2VjdGlvbl0pIHtcbiAgICAgIGdyYXBoW3NlY3Rpb25dID0ge1xuICAgICAgICByb3V0ZVRpdGxlOiBzZWN0aW9uVGl0bGUsXG4gICAgICAgIHJvdXRlTWV0YTogbWV0YSxcbiAgICAgICAgZmlsZXBhdGg6IGZpbGUuZnNQYXRoLFxuICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgZmlsZUV4dGVuc2lvbjogZXh0LFxuICAgICAgICByb3V0ZUFiczogYC8ke3NlY3Rpb24gPT09IFwiX2luZGV4XCIgPyBcIlwiIDogc2VjdGlvbn1gLFxuICAgICAgICByb3V0ZVJlbDogc2VjdGlvbiA9PT0gXCJfaW5kZXhcIiA/IFwiL1wiIDogc2VjdGlvbixcbiAgICAgICAgdG9jOiBbXSxcbiAgICAgICAgcGFnZXM6IHt9XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHNldCB0aGUgZ3JhcGggdG8gdGhlIGN1cnJlbnQgZ3JhcGguXG4gICAgLy8ganMgd29ya3Mgd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBncmFwaCBpcyBqdXN0XG4gICAgLy8gbm93IGEgcmVmZXJlbmNlIHRvIGN1cnJlbnQgZ3JhcGggd2hpY2ggd2UgcmVjdXJzaXZlbHlcbiAgICAvLyB1cGRhdGUgaWYgbmVlZCBpdFxuICAgIGxldCBjdXJyZW50R3JhcGggPSBzZWN0aW9uID8gZ3JhcGhbc2VjdGlvbl0ucGFnZXMgOiBncmFwaDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudEluZGV4IGluIHNlZ21lbnRzKSB7XG4gICAgICBjb25zdCBpID0gTnVtYmVyKHNlZ21lbnRJbmRleCk7XG4gICAgICBjb25zdCBzZWdtZW50ID0gc2VnbWVudHNbaV07XG4gICAgICBpZiAoIWN1cnJlbnRHcmFwaFtzZWdtZW50XSkge1xuICAgICAgICBjdXJyZW50R3JhcGhbc2VnbWVudF0gPSB7XG4gICAgICAgICAgcm91dGVUaXRsZTogXCJcIixcbiAgICAgICAgICBmaWxlcGF0aDogXCJcIixcbiAgICAgICAgICBmaWxlbmFtZTogXCJcIixcbiAgICAgICAgICBmaWxlRXh0ZW5zaW9uOiBcIlwiLFxuICAgICAgICAgIHJvdXRlQWJzOiBcIlwiLFxuICAgICAgICAgIHJvdXRlUmVsOiBcIlwiLFxuICAgICAgICAgIHJvdXRlTWV0YTogW10sXG4gICAgICAgICAgdG9jOiBbXSxcbiAgICAgICAgICBwYWdlczoge31cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGkgPT09IHNlZ21lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY3VycmVudEdyYXBoW3NlZ21lbnRdLnJvdXRlVGl0bGUgPSB0aXRsZTtcbiAgICAgICAgY3VycmVudEdyYXBoW3NlZ21lbnRdLnJvdXRlTWV0YSA9IG1ldGE7XG4gICAgICAgIGN1cnJlbnRHcmFwaFtzZWdtZW50XS5maWxlcGF0aCA9IGZpbGUuZnNQYXRoO1xuICAgICAgICBjdXJyZW50R3JhcGhbc2VnbWVudF0uZmlsZW5hbWUgPSBmaWxlLmZpbGVuYW1lO1xuICAgICAgICBjdXJyZW50R3JhcGhbc2VnbWVudF0uZmlsZUV4dGVuc2lvbiA9IGV4dDtcbiAgICAgICAgY3VycmVudEdyYXBoW3NlZ21lbnRdLnJvdXRlQWJzID0gcm91dGVBYnM7XG4gICAgICAgIGN1cnJlbnRHcmFwaFtzZWdtZW50XS5yb3V0ZVJlbCA9IHNlZ21lbnQ7XG4gICAgICAgIGN1cnJlbnRHcmFwaFtzZWdtZW50XS50b2MgPSB0b2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50R3JhcGggPSBjdXJyZW50R3JhcGhbc2VnbWVudF0ucGFnZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gZm9yIGVhY2ggZmlsZSBmaW5kIGEgcGxhY2UgZm9yIGl0IGluIHRoZSBncmFwaFxuICBmb3IgKGNvbnN0IGZpbGVJbmRleCBpbiBvcmRlcmVkRmlsZXMpIHtcbiAgICBjb25zdCBmaWxlID0gb3JkZXJlZEZpbGVzW2ZpbGVJbmRleF07XG4gICAgYXdhaXQgaW5zZXJ0Tm9kZShmaWxlKTtcbiAgfVxuXG4gIExPRy5kZWJ1ZyhcIkdlbmVyYXRpbmcgZ3JhcGggcmVwcmVzZW50YXRpb24gb2YgZG9jcy4uLiBkb25lLlwiKTtcbiAgcmV0dXJuIGdyYXBoO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBrZWJhYlRvUGFzY2FsQ2FzZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHJcbiAgICAuc3BsaXQoL1stXFxzXS8pIC8vIFNwbGl0IGJ5IGh5cGhlbnMgb3Igc3BhY2VzXG4gICAgLm1hcCgod29yZCkgPT4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSkudG9Mb3dlckNhc2UoKSlcbiAgICAuam9pbihcIlwiKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLmF1dG9PcmRlckJ1dHRlcnlEb2NGaWxlcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MuYXV0b09yZGVyQnV0dGVyeURvY0ZpbGVzLnRzXCI7aW1wb3J0IHsga2ViYWJUb1Bhc2NhbENhc2UgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvdHMvdXRpbC50cy5rZWJhYi10by1wYXNjYWwtY2FzZVwiO1xuaW1wb3J0IHR5cGUgeyBCdXR0ZXJ5Q29uZmlnRG9jc09yZGVyIH0gZnJvbSBcIi4uL19idXR0ZXJ5LWNvbmZpZ1wiO1xuaW1wb3J0IHsgcGFyc2VGaWxlbmFtZSB9IGZyb20gXCIuL2RvY3MucGFyc2VGaWxlbmFtZVwiO1xuaW1wb3J0IHR5cGUgeyBGaWxlT2JqIH0gZnJvbSBcIi4vZG9jcy50eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0b09yZGVyQnV0dGVyeURvY0ZpbGVzKGZpbGVzOiBGaWxlT2JqW10pIHtcbiAgLy8gdHJ5IHRvIGNyZWF0ZSB0aGUgZmlsZSBvcmRlciBhdXRvbWF0aWNhbGx5XG4gIHJldHVybiBmaWxlcy5yZWR1Y2U8QnV0dGVyeUNvbmZpZ0RvY3NPcmRlcj4oKGFjY3VtLCBmaWxlKSA9PiB7XG4gICAgY29uc3QgeyBzZWN0aW9uLCByb3V0ZSB9ID0gcGFyc2VGaWxlbmFtZShmaWxlLmZpbGVuYW1lKTtcbiAgICBpZiAoc2VjdGlvbiA9PT0gXCJfaW5kZXhcIikgcmV0dXJuIGFjY3VtO1xuICAgIGNvbnN0IHNlY3Rpb25BbHJlYWR5QWRkZWQgPSBhY2N1bVtzZWN0aW9uXTtcbiAgICBpZiAoIXNlY3Rpb25BbHJlYWR5QWRkZWQpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjY3VtLCB7XG4gICAgICAgIFtzZWN0aW9uXToge1xuICAgICAgICAgIGRpc3BsYXk6IGtlYmFiVG9QYXNjYWxDYXNlKHNlY3Rpb24pLFxuICAgICAgICAgIHJvdXRlT3JkZXI6IFtyb3V0ZV1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHJvdXRlT3JkZXIgPSBhY2N1bVtzZWN0aW9uXS5yb3V0ZU9yZGVyO1xuICAgIC8vIGFkZCB0aGUgcm91dGVcbiAgICByb3V0ZU9yZGVyLnB1c2gocm91dGUpO1xuICAgIC8vIHNvcnQgdGhlIG9yZGVyIGJhc2VkIHVwb24gbGVuZ3RoXG4gICAgcm91dGVPcmRlci5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCAtIGIubGVuZ3RoKTtcbiAgICAvLyBmaW5kIHRoZSBzZWN0aW9uIGluZGV4IHBhZ2UgYW5kIG1vdmUgaXQgdG8gdGhlIGZyb250IG9mIHRoZSByb3V0ZU9yZGVyXG4gICAgY29uc3Qgc2VjdGlvblBhZ2VJbmRleCA9IHJvdXRlT3JkZXIuZmluZEluZGV4KChyb3V0ZSkgPT4gcm91dGUgPT09IHNlY3Rpb24pO1xuICAgIGlmIChzZWN0aW9uUGFnZUluZGV4ID4gLTEpIHtcbiAgICAgIHJvdXRlT3JkZXIudW5zaGlmdChyb3V0ZU9yZGVyLnNwbGljZShzZWN0aW9uUGFnZUluZGV4LCAxKVswXSk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjY3VtLCB7XG4gICAgICBbc2VjdGlvbl06IHtcbiAgICAgICAgLi4uYWNjdW1bc2VjdGlvbl0sXG4gICAgICAgIHJvdXRlT3JkZXJcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwge30pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3Mub3JkZXJCdXR0ZXJ5RG9jRmlsZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLm9yZGVyQnV0dGVyeURvY0ZpbGVzLnRzXCI7aW1wb3J0IHR5cGUgeyBCdXR0ZXJ5Q29uZmlnRG9jc09yZGVyIH0gZnJvbSBcIi4uL19idXR0ZXJ5LWNvbmZpZ1wiO1xuaW1wb3J0IHsgTE9HIH0gZnJvbSBcIi4uL19sb2dnZXIvdXRpbC50cy5sb2dnZXJcIjtcbmltcG9ydCB7IGF1dG9PcmRlckJ1dHRlcnlEb2NGaWxlcyB9IGZyb20gXCIuL2RvY3MuYXV0b09yZGVyQnV0dGVyeURvY0ZpbGVzXCI7XG5pbXBvcnQgdHlwZSB7IEJ1dHRlcnlEb2NzQ29uZmlnIH0gZnJvbSBcIi4vZG9jcy5nZXRCdXR0ZXJ5RG9jc0NvbmZpZ1wiO1xuaW1wb3J0IHR5cGUgeyBGaWxlT2JqIH0gZnJvbSBcIi4vZG9jcy50eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gb3JkZXJCdXR0ZXJ5RG9jRmlsZXMoXG4gIGRvY3NDb25maWc6IEJ1dHRlcnlEb2NzQ29uZmlnLFxuICBmaWxlczogRmlsZU9ialtdXG4pOiBGaWxlT2JqW10ge1xuICBsZXQgcmVjb25jaWxlZE9yZGVyOiBCdXR0ZXJ5Q29uZmlnRG9jc09yZGVyO1xuXG4gIGlmICghZG9jc0NvbmZpZy5kb2NzLm9yZGVyKSB7XG4gICAgTE9HLndhcm5pbmcoXCJObyBjdXN0b20gb3JkZXIgZGVmaW5lZC4uLiBhdXRvIG9yZGVyaW5nXCIpO1xuICAgIHJlY29uY2lsZWRPcmRlciA9IGF1dG9PcmRlckJ1dHRlcnlEb2NGaWxlcyhmaWxlcyk7XG4gIH0gZWxzZSB7XG4gICAgcmVjb25jaWxlZE9yZGVyID0gZG9jc0NvbmZpZy5kb2NzLm9yZGVyO1xuICB9XG5cbiAgY29uc3Qgb0ZpbGVzOiBGaWxlT2JqW10gPSBbXTtcblxuICAvLyBsb29wIHRocm91Z2ggdGhyb3VnaCB0aGUgZG9jcy5vcmRlciBjb25maWd1cmF0aW9uIHByb3BlcnR5XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBpbiByZWNvbmNpbGVkT3JkZXIpIHtcbiAgICBjb25zdCBzZWN0aW9uT3JkZXIgPSByZWNvbmNpbGVkT3JkZXJbc2VjdGlvbl0ucm91dGVPcmRlcjtcbiAgICBmb3IgKGNvbnN0IHNlY3Rpb25Sb3V0ZSBvZiBzZWN0aW9uT3JkZXIpIHtcbiAgICAgIC8vIGFkZCB0aGUgc2VjdGlvbiBpbmRleCBmaWxlIGZpcnN0XG4gICAgICBjb25zdCBzZWN0aW9uSW5kZXhGaWxlID0gZmlsZXMuZmluZCgoZmlsZSkgPT4gZmlsZS5maWxlbmFtZSA9PT0gc2VjdGlvbik7XG4gICAgICBjb25zdCBvRmlsZXNIYXNTZWN0aW9uSW5kZXhGaWxlID0gb0ZpbGVzLmZpbmQoXG4gICAgICAgIChmKSA9PiBmLmZpbGVuYW1lID09PSBzZWN0aW9uSW5kZXhGaWxlPy5maWxlbmFtZVxuICAgICAgKTtcbiAgICAgIGlmICghb0ZpbGVzSGFzU2VjdGlvbkluZGV4RmlsZSAmJiBzZWN0aW9uSW5kZXhGaWxlKSB7XG4gICAgICAgIG9GaWxlcy5wdXNoKHNlY3Rpb25JbmRleEZpbGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgdGhlIG9yZGVyZWQgZmlsZSBuYW1lIHNlY29uZFxuICAgICAgY29uc3Qgb3JkZXJlZEZpbGUgPSBmaWxlcy5maW5kKFxuICAgICAgICAoZmlsZSkgPT4gZmlsZS5maWxlbmFtZSA9PT0gYCR7c2VjdGlvbn0uJHtzZWN0aW9uUm91dGV9YFxuICAgICAgKTtcbiAgICAgIGlmIChvcmRlcmVkRmlsZSkgb0ZpbGVzLnB1c2gob3JkZXJlZEZpbGUpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgIGNvbnN0IGZpbGVBbHJlYWR5T3JkZXJlZCA9IG9GaWxlcy5maW5kKFxuICAgICAgKG9GaWxlKSA9PiBvRmlsZS5maWxlbmFtZSA9PT0gZmlsZS5maWxlbmFtZVxuICAgICk7XG4gICAgaWYgKCFmaWxlQWxyZWFkeU9yZGVyZWQgJiYgZmlsZS5maWxlbmFtZSA9PT0gXCJfaW5kZXhcIikge1xuICAgICAgLy8gYWRkIHRoZSBfaW5kZXggZmlsZSB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBvcmRlclxuICAgICAgb0ZpbGVzLnVuc2hpZnQoZmlsZSk7XG4gICAgfSBlbHNlIGlmICghZmlsZUFscmVhZHlPcmRlcmVkKSB7XG4gICAgICAvLyBhZGQgdGhlIHVuIG9yZGVyZWQgZmlsZXMgdG8gdGhlIGVuZCBvZiB0aGUgb3JkZXJcbiAgICAgIExPRy53YXJuaW5nKFxuICAgICAgICBgTm8gb3JkZXIgZGVmaW5lZCBmb3IgXCIke2ZpbGUuZmlsZW5hbWV9XCIuIE9yZGVyaW5nIGFyYml0cmFyaWx5LmBcbiAgICAgICk7XG4gICAgICBvRmlsZXMucHVzaChmaWxlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9GaWxlcztcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnZpdGUtcGx1Z2luLW1keC1jb2RlLWV4YW1wbGVzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy52aXRlLXBsdWdpbi1tZHgtY29kZS1leGFtcGxlcy50c1wiO2ltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gXCJub2RlOmZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5cbnR5cGUgTWR4VHJhbnNmb3JtQ29kZUV4YW1wbGVzT3B0aW9ucyA9IHtcbiAgcm9vdFBhdGg6IHN0cmluZztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtZHhUcmFuc2Zvcm1Db2RlRXhhbXBsZXMoXG4gIG9wdGlvbnM6IE1keFRyYW5zZm9ybUNvZGVFeGFtcGxlc09wdGlvbnNcbik6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgZW5mb3JjZTogXCJwcmVcIixcbiAgICBuYW1lOiBcInZpdGUtcGx1Z2luLW1keC10cmFuc2Zvcm0tY29kZVwiLFxuICAgIHRyYW5zZm9ybShjb2RlOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmICghaWQuZW5kc1dpdGgoXCIubWR4XCIpKSByZXR1cm47XG5cbiAgICAgIC8qKlxuICAgICAgICogQWRqdXN0ZWQgcmVnZXggdG8gY2FwdHVyZSBldmVyeXRoaW5nIGFmdGVyIGV4YW1wbGU6IHVudGlsIGV4YW1wbGU6ZW5kXG4gICAgICAgKlxuICAgICAgICogVE9ETzogVGhpcyBuZWVkcyB0byBiZSBmaXhlZCB0byBmaXggYW55IGlzc3Vlc1xuICAgICAgICovXG4gICAgICBsZXQgbWF0Y2hOdW0gPSAxO1xuICAgICAgY29uc3QgcmVnZXggPSAvXFx7XFwvXFwqIGV4YW1wbGU6XCIoW15cIl0rKVwiIFxcKlxcL1xcfS9nO1xuICAgICAgY29uc3QgdHJhbnNmb3JtZWRQcmV2aWV3ID0gY29kZS5yZXBsYWNlKHJlZ2V4LCAoX21hdGNoLCBwMSkgPT4ge1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZFBhdGggPSBwYXRoLmpvaW4ob3B0aW9ucy5yb290UGF0aCwgcDEpO1xuICAgICAgICBjb25zdCBwcmV2aWV3QmxvY2tQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgIG9wdGlvbnMucm9vdFBhdGgsXG4gICAgICAgICAgXCIvbGliL2J1dHRlcnktY29tcG9uZW50cy9kb2NzL1ByZXZpZXdCbG9jay50c3hcIlxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjb2RlQmxvY2sgPSByZWFkRmlsZVN5bmModHJhbnNmb3JtZWRQYXRoLCB7IGVuY29kaW5nOiBcInV0ZjhcIiB9KTtcbiAgICAgICAgY29uc3QgbmV3Q29kZSA9IGBcblxuaW1wb3J0IHsgZGVmYXVsdCBhcyBQcmV2aWV3QmxvY2ske21hdGNoTnVtfSB9IGZyb20gXCIke3ByZXZpZXdCbG9ja1BhdGh9XCI7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIENvbXBvbmVudCR7bWF0Y2hOdW19IH0gZnJvbSBcIiR7dHJhbnNmb3JtZWRQYXRofVwiO1xuXG48UHJldmlld0Jsb2NrJHttYXRjaE51bX0+XG4gIDxDb21wb25lbnQke21hdGNoTnVtfSAvPlxuICBcXGBcXGBcXGB0c3hcbiAgJHtjb2RlQmxvY2t9XG4gIFxcYFxcYFxcYFxuPC9QcmV2aWV3QmxvY2ske21hdGNoTnVtfT5cblxuYDtcbiAgICAgICAgbWF0Y2hOdW0rKztcbiAgICAgICAgcmV0dXJuIG5ld0NvZGU7XG4gICAgICB9KTtcblxuICAgICAgLy8gY29uc3QgdHJhbnNmb3JtZWRQcmV2aWV3ID0gY29kZTtcblxuICAgICAgLy8gQWRqdXN0ZWQgcmVnZXggdG8gY2FwdHVyZSBldmVyeXRoaW5nIGFmdGVyIGV4YW1wbGU6IHVudGlsIGV4YW1wbGU6ZW5kXG4gICAgICBjb25zdCBmZW5jZVJlZ2V4ID0gL1xce1xcL1xcKiBmZW5jZTpcIihbXlwiXSspXCIgXFwqXFwvXFx9L2c7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1lZEZlbmNlID0gdHJhbnNmb3JtZWRQcmV2aWV3LnJlcGxhY2UoXG4gICAgICAgIGZlbmNlUmVnZXgsXG4gICAgICAgIChfbWF0Y2gsIHAxKSA9PiB7XG4gICAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRQYXRoID0gcGF0aC5qb2luKG9wdGlvbnMucm9vdFBhdGgsIHAxKTtcbiAgICAgICAgICBjb25zdCBjb2RlQmxvY2sgPSByZWFkRmlsZVN5bmModHJhbnNmb3JtZWRQYXRoLCB7IGVuY29kaW5nOiBcInV0ZjhcIiB9KTtcbiAgICAgICAgICByZXR1cm4gYFxuXFxgXFxgXFxgdHN4XG4gICR7Y29kZUJsb2NrfVxuICBcXGBcXGBcXGBcbmA7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IHRyYW5zZm9ybWVkRmVuY2UsXG4gICAgICAgIG1hcDogbnVsbCAvLyBQcm92aWRlIHNvdXJjZSBtYXAgaWYgbmVjZXNzYXJ5XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXdkZWNhcm1lL2dpdC9wZXJzb25hbC9idXR0ZXJ5LXRvb2xzL3BhY2thZ2VzL2J1dHRlcnktdG9vbHMvLmJ1dHRlcnkvY29tbWFuZHMvZG9jcy9kb2NzLnZpdGUtcGx1Z2luLW1keC10cmFuc2Zvcm0taW1wb3J0cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3Mudml0ZS1wbHVnaW4tbWR4LXRyYW5zZm9ybS1pbXBvcnRzLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuXG50eXBlIE1keFRyYW5zZm9ybUltcG9ydHNPcHRpb25zID0ge1xuICByb290UGF0aDogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBBIFZpdGUgcGx1Z2luIHRoYXQgc2VhcmNoZXMgZm9yIGltcG9ydHMgdGhhdCBiZWluZyB3aXRoIHRoZSB+IGFuZFxuICogdGhlbiB0cmFuc2Zvcm1zIHRoZW1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1keFRyYW5zZm9ybUltcG9ydHMoXG4gIG9wdGlvbnM6IE1keFRyYW5zZm9ybUltcG9ydHNPcHRpb25zXG4pOiBQbHVnaW4ge1xuICByZXR1cm4ge1xuICAgIGVuZm9yY2U6IFwicHJlXCIsXG4gICAgbmFtZTogXCJ2aXRlLXBsdWdpbi1tZHgtdHJhbnNmb3JtLWltcG9ydHNcIixcbiAgICB0cmFuc2Zvcm0oY29kZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgICBpZiAoIWlkLmVuZHNXaXRoKFwiLm1keFwiKSkgcmV0dXJuO1xuICAgICAgLy8gLy8gVHJhbnNmb3JtIHN0cmluZ3Mgd2l0aCBwYXRocyBzdGFydGluZyB3aXRoIHRpbGRlICh+KVxuICAgICAgY29uc3QgdHJhbnNmb3JtZWRTdHJpbmdzID0gY29kZS5yZXBsYWNlKFxuICAgICAgICAvWydcIl0oflxcL1teJ1wiXSspWydcIl0vZyxcbiAgICAgICAgKF9tYXRjaCwgcDEpID0+IHtcbiAgICAgICAgICBjb25zdCByZWxQYXRoID0gcDEuc3BsaXQoXCJ+XCIpWzFdO1xuICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkUGF0aCA9IHBhdGguam9pbihvcHRpb25zLnJvb3RQYXRoLCByZWxQYXRoKTtcbiAgICAgICAgICByZXR1cm4gYCcke3RyYW5zZm9ybWVkUGF0aH0nYDtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogdHJhbnNmb3JtZWRTdHJpbmdzLFxuICAgICAgICBtYXA6IG51bGwgLy8gUHJvdmlkZSBzb3VyY2UgbWFwIGlmIG5lY2Vzc2FyeVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL2RvY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzLy5idXR0ZXJ5L2NvbW1hbmRzL2RvY3MvZG9jcy52aXRlLXBsdWdpbi10cmFuc2Zvcm0tbWFya2Rvd24tYXNzZXQtcGF0aC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3Mudml0ZS1wbHVnaW4tdHJhbnNmb3JtLW1hcmtkb3duLWFzc2V0LXBhdGgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5cbi8qKlxuICogVGhpcyBwbHVnaW4gc2NhbnMgLm1kIGZpbGVzIGFuZCB0cmFuc2Zvcm1zIHRoZVxuICogYXNzZXQgcGF0aHMgZnJvbSAuL3B1YmxpYy8uLi4gdG8gLy4uLiBkdXJpbmcgdGhlIGJ1aWxkIHByb2Nlc3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1NYXJrZG93bkFzc2V0UGF0aCgpOiBQbHVnaW4ge1xuICByZXR1cm4ge1xuICAgIGVuZm9yY2U6IFwicHJlXCIsXG4gICAgbmFtZTogXCJtYXJrZG93bi1pbWFnZS1wYXRoLXRyYW5zZm9ybVwiLFxuICAgIHRyYW5zZm9ybShjb2RlOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmIChpZC5lbmRzV2l0aChcIi5tZFwiKSkge1xuICAgICAgICAvLyBSZXBsYWNlIHRoZSAuL3B1YmxpYyB3aXRoIC9wdWJsaWMgVVJMXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkQ29kZSA9IGNvZGUucmVwbGFjZShcbiAgICAgICAgICAvIVxcWyhbXlxcXV0qKVxcXVxcKFxcLlxcL3B1YmxpY1xcLyhbXildKilcXCkvZyxcbiAgICAgICAgICBcIiFbJDFdKC8kMilcIlxuICAgICAgICApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvZGU6IHRyYW5zZm9ybWVkQ29kZSxcbiAgICAgICAgICBtYXA6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGUsXG4gICAgICAgIG1hcDogbnVsbFxuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3ZGVjYXJtZS9naXQvcGVyc29uYWwvYnV0dGVyeS10b29scy9wYWNrYWdlcy9idXR0ZXJ5LXRvb2xzL2xpYi9idXR0ZXJ5LWRvY3MvYXBwcy9jbG91ZGZsYXJlLXBhZ2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy9saWIvYnV0dGVyeS1kb2NzL2FwcHMvY2xvdWRmbGFyZS1wYWdlcy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJld2RlY2FybWUvZ2l0L3BlcnNvbmFsL2J1dHRlcnktdG9vbHMvcGFja2FnZXMvYnV0dGVyeS10b29scy9saWIvYnV0dGVyeS1kb2NzL2FwcHMvY2xvdWRmbGFyZS1wYWdlcy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGdldEJ1dHRlcnlEb2NzVml0ZUNvbmZpZyB9IGZyb20gXCIuLi8uLi8uLi8uLi8uYnV0dGVyeS9jb21tYW5kcy9kb2NzL2RvY3MuZ2V0QnV0dGVyeURvY3NWaXRlQ29uZmlnXCI7XG5cbmNvbnN0IGRlZmluZUNvbmZpZyA9IGF3YWl0IGdldEJ1dHRlcnlEb2NzVml0ZUNvbmZpZygpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4gKHt9KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVlLE9BQU9BLFlBQVU7QUFDeGYsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsY0FBYyxhQUFhO0FBQ3BDLFNBQVMsZ0NBQWdDLCtCQUErQjtBQUN4RSxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFNBQVM7QUFDaEIsT0FBTyw0QkFBNEI7QUFDbkMsT0FBT0MsaUJBQWdCO0FBQ3ZCLE9BQU8sdUJB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QkFBTSxpQkFBaUJDLE9BQUs7QUFBQSxjQUMxQixLQUFLLFVBQVUsS0FBSyxTQUFTO0FBQUEsY0FDN0I7QUFBQSxZQUNGO0FBQ0Esa0JBQU0sSUFBSSxnQkFBZ0IsTUFBTTtBQUU5Qix5QkFBVyxRQUFRLGNBQWM7QUFDL0Isb0JBQUksS0FBSyxhQUFhLFNBQVU7QUFFaEMsc0JBQU0sS0FBSyxXQUFXLEtBQUssUUFBUTtBQUFBLGtCQUNqQyxPQUFPLEtBQUssU0FBUyxTQUFTLFFBQVE7QUFBQSxnQkFDeEMsQ0FBQztBQUFBLGNBQ0g7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNILENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRixDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBMkNIO0FBQUEsRUFDRjtBQUVBLFNBQU8sU0FBU0MsY0FDZCxJQUlBO0FBQ0EsVUFBTSxhQUFhLEdBQUcsRUFBRSxRQUFRLEtBQUssQ0FBQztBQUN0QyxXQUFPLFlBQW9DLFlBQVksVUFBVTtBQUFBLEVBQ25FO0FBQ0Y7OztBOEJ0S0EsSUFBTSxlQUFlLE1BQU0seUJBQXlCO0FBRXBELElBQU8sc0JBQVEsYUFBYSxPQUFPLENBQUMsRUFBRTsiLAogICJuYW1lcyI6IFsicGF0aCIsICJyZWh5cGVTbHVnIiwgInBhdGgiLCAicGF0aCIsICJwYXRoIiwgInBhdGgiLCAiYWNjdW0iLCAicGF0aCIsICJwYXRoIiwgInBhdGgiLCAicGF0aCIsICJwYXRoIiwgInJlYWRGaWxlIiwgInBhdGgiLCAicGF0aCIsICJwYXRoIiwgInBhdGgiLCAicmVhZEZpbGUiLCAicGF0aCIsICJpbnB1dCIsICJwYXRoIiwgInBhdGgiLCAicmVhZEZpbGUiLCAicGF0aCIsICJyZWFkRmlsZSIsICJwYXRoIiwgInJvdXRlIiwgInBhdGgiLCAicGF0aCIsICJwYXRoIiwgInBhdGgiLCAicmVoeXBlU2x1ZyIsICJwYXRoIiwgImRlZmluZUNvbmZpZyJdCn0K
