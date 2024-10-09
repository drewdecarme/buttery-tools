import { mkdirSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { ButteryLogger, printAsBullets } from "@buttery/logger";
import esbuild from "esbuild";
import ts from "typescript";

const LOG = new ButteryLogger({
  id: "buttery-logger",
  prefix: "buttery:logger",
  prefixBgColor: "#f8d334",
  logLevel: "debug",
});

export async function buildScripts(options: {
  scriptsDir: string;
  outDir: string;
}) {
  LOG.info(`Building scripts in: ${options.scriptsDir}`);
  LOG.debug("Locating run files...");
  const entryPointDirents = await readdir(options.scriptsDir, {
    encoding: "utf8",
    withFileTypes: true,
  });
  const entryPoints = entryPointDirents.reduce<string[]>((accum, dirent) => {
    if (dirent.isFile() && dirent.name.startsWith("run.")) {
      const direntPath = path.resolve(dirent.parentPath, dirent.name);
      return accum.concat(direntPath);
    }
    return accum;
  }, []);
  LOG.debug("Locating run files... done");

  LOG.debug(`Building the following scripts:${printAsBullets(entryPoints)}`);
  try {
    await esbuild.build({
      bundle: true,
      minify: false,
      entryPoints,
      format: "esm",
      platform: "node",
      target: ["node22.9.0"],
      outdir: options.outDir,
      packages: "external",
      plugins: [
        {
          name: "d.ts",
          setup(build) {
            const rootDir = process.cwd();
            build.onEnd(() => {
              LOG.debug("Creating TS declaration files...");

              // Load TypeScript configuration
              const configPath = ts.findConfigFile(rootDir, ts.sys.fileExists);
              if (!configPath) {
                throw LOG.fatal(
                  new Error(
                    `Could not find a valid tsconfig.json file at ${rootDir}`
                  )
                );
              }

              const configContent = ts.readConfigFile(
                configPath,
                ts.sys.readFile
              );
              const config = ts.parseJsonConfigFileContent(
                configContent.config,
                ts.sys,
                rootDir
              );

              // Compile the TypeScript files and emit declaration files
              const program = ts.createProgram(config.fileNames, {
                ...config.options,
                declaration: true, // Enable declaration file generation
                emitDeclarationOnly: true, // Emit only declarations
                outDir: options.outDir,
              });

              const emitResult = program.emit(undefined, (fileName, data) => {
                // Write the declaration files to the specified output directory
                const outputPath = path.resolve(
                  build.initialOptions.outdir || "dist",
                  path.relative(rootDir, fileName)
                );
                mkdirSync(path.dirname(outputPath), { recursive: true });
                writeFileSync(outputPath, data);
              });

              // Check for compilation errors
              const diagnostics = ts
                .getPreEmitDiagnostics(program)
                .concat(emitResult.diagnostics);
              // biome-ignore lint/complexity/noForEach: <explanation>
              diagnostics.forEach((diagnostic) => {
                if (diagnostic.file) {
                  const { line, character } = ts.getLineAndCharacterOfPosition(
                    diagnostic.file,
                    diagnostic.start as number
                  );
                  const message = ts.flattenDiagnosticMessageText(
                    diagnostic.messageText,
                    "\n"
                  );
                  console.log(
                    `${diagnostic.file.fileName} (${line + 1},${
                      character + 1
                    }): ${message}`
                  );
                } else {
                  console.log(
                    ts.flattenDiagnosticMessageText(
                      diagnostic.messageText,
                      "\n"
                    )
                  );
                }
              });

              if (emitResult.emitSkipped) {
                throw LOG.fatal(
                  new Error("TypeScript type definition generation failed.")
                );
              }

              LOG.debug("Creating TS declaration files... done.");
            });
          },
        },
      ],
    });
    LOG.success("Build complete!");
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Error when trying to build the scripts for consumption in the @buttery/tools CLI: ${error}`
      )
    );
  }
}
