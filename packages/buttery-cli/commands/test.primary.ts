import { CommandAction, CommandMeta, CommandOptions } from "../src/types";

export const meta: CommandMeta = {
  name: "data",
  description: "Cras mattis consectetur purus sit amet fermentum.",
};

export const options: CommandOptions = {
  background: {
    type: "value",
    alias: "b",
    description: "display just the first substring",
    required: false,
  },
  "should-load": {
    type: "boolean",
    alias: "sl",
    description: "If something should load",
    required: false,
  },
};

// export const args: CommandArgs = [
//   {
//     name: "username",
//     description: "user to login",
//     required: false,
//   },
//   {
//     name: "password",
//     description: "password for user, if required",
//     required: false,
//   },
// ];

export const action: CommandAction<typeof options> = async (params) => {
  console.log(`Hello from the "test.primary" command.`, params);
};
