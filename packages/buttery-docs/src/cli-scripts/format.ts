// LOG_CLI.watch("Formatting...");

import { LOG } from "../utils";

// const decision = await select<"navigation">({
//   message: "What would you like to format?",
//   choices: [
//     {
//       value: "navigation",
//       name: "Navigation",
//       description:
//         'Prints out a "best guest" order of the navigation / routing tree that you can then add to the "config.docs.order" key in the ".buttery/config.ts" file',
//     },
//   ],
// });

// switch (decision) {
//   case "navigation":
//     console.log("hello!");
//     return;

//   default:
//     return exhaustiveMatchGuard(decision);
// }

export async function format() {
  LOG.debug("TODO: Add the docs formatter");
}
