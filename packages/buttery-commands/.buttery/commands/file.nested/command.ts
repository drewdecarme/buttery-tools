import {
  type CommandAction,
  defineAction,
  defineMeta,
  defineOptions,
} from "../../../src/types";

export const meta = defineMeta({
  name: "nested",
  description:
    "A command that tests out the nested flat-file sub-command convention",
});

export const options = defineOptions([
  {
    type: "boolean",
    name: "test",
    description: "A test description",
  },
  {
    type: "string",
    name: "favorite-color",
    description: "Describe your favorite color",
  },
] as const);

// export const action = defineAction<typeof options>(async ({ options }) => {
//   // options.
// });

export const action: CommandAction<typeof options> = async ({ options }) => {
  options;
};
