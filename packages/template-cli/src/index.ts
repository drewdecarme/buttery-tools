#! /usr/bin/env node
import { program } from "commander";

import { commandData } from "./data/index.js";

// add the commands
program.name("mqi");
program.addCommand(commandData);

program.parseAsync(process.argv);
