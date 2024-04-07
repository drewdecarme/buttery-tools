import { Command } from "commander";

import { commandDataAssetLocationHistory } from "./data.create-location-history.command.js";
import { commandDataCreateSensorHistory } from "./data.create-sensor-history.command.js";
import "../utils/util.env-vars.js";

// import { optionEnv, validateOptionEnv } from "./option.env.js";

export const commandData = new Command("data").description(
  "Commands to create data for complex UI scenarios"
);

commandData
  // adding options sequentially like this will enable them for commands added
  // below it. In this case, get and seed will be able to access the options
  // added after this comment
  // .addOption(optionEnv)
  // .action((args) => {
  //   validateOptionEnv(args);
  // })
  .addCommand(commandDataAssetLocationHistory)
  .addCommand(commandDataCreateSensorHistory);
// .parseAsync(process.argv);
