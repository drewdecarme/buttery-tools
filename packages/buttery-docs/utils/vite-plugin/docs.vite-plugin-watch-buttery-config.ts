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
