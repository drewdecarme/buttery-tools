// try {
//   const config = await getButteryDocsConfig();
//   const dirs = await getButteryDocsDirectories(config);

//   await viteBuild(dirs.artifacts.apps.working.root, {
//     config: dirs.artifacts.apps.working.viteConfig,
//     emptyOutDir: true,
//     clearScreen: false,
//     force: true,
//     logLevel: "info",
//   });

//   switch (config.docs.buildTarget) {
//     case "cloudflare-pages": {
//       // move functions to local dist
//       const functionsDir = path.resolve(
//         dirs.artifacts.apps.working.root,
//         "./functions"
//       );
//       await cp(functionsDir, path.resolve(dirs.output.root, "./functions"), {
//         recursive: true,
//       });
//       break;
//     }

//     default:
//       break;
//   }

//   // Report the success
//   const filesAndDirs = await readdir(dirs.output.root, {
//     recursive: true,
//     withFileTypes: true,
//   });

//   const files = filesAndDirs.filter((dirent) => dirent.isFile());
//   LOG_CLI.success(`Successfully built documentation app!

//   Location: ${dirs.output.root}
//   Total Files: ${files.length}

// ${files.reduce(
//   (accum, file) =>
//     accum.concat(
//       `    - ${path.relative(
//         dirs.output.root,
//         `${file.parentPath}/${file.name}`
//       )}\n`
//     ),
//   ""
// )}
// `);

//   exit();
// } catch (error) {
//   throw LOG_CLI.fatal(new Error(error as string));
// }
import { LOG } from "../utils/docs.utils";

export async function build() {
  LOG.debug("TODO: Create the build script");
}
