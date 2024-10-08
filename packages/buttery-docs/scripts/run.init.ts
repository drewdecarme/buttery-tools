// try {
//   const config = await getButteryDocsConfig();

//   // ask some questions
//   const relativeDocsFolder = await input({
//     message:
//       "Where is your docs directory? This is where you will store all of your markdown | mdx files to be compiled for rendering.",
//     default: "./docs",
//   });
//   const framework = await select({
//     message:
//       "Please select a development and build meta framework. This will determine what your build outputs to then be deployed",
//     choices: [
//       {
//         description:
//           "Creates your docs using Remix and sets the deployment target for cloudflare-pages",
//         value: "remix-cloudflare-pages",
//       },
//     ],
//   });

//   const docsFolder = path.resolve(config.paths.rootDir, relativeDocsFolder);

//   console.log({ docsFolder, framework });
// } catch (error) {
//   throw LOG_CLI.fatal(new Error(error as string));
// }
export {};
