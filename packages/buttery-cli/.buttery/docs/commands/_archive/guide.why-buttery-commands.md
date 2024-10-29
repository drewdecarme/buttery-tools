---
title: Why Buttery Commands
---

# Why Buttery Commands

## Background

**Writing a CLI is hard**.

There are many tools out there in the node registry that abstract a lot of the complexity of the node process away to easily parse options and arguments. Those tools, in this authors opinion, do a lot of the heavy lifting to create CLIs in a concise manner.

However, when using those tools, the authoring concepts as well as the conventions leave a little bit to be desired. Some of them prioritize chaining and other use a more modular functional API. Fully understanding the architectural and organization needs of each tools differs drastically and if you're like me, where you're looking to mostly create a simple, straightforward CLI, it can be a bit frustrating to fully grapple with what needs to be done.

**Buttery Commands** attempts to solve the developer experience (DX) by providing a simple, type-safe, and most importantly, modular way of authoring CLI commands. You can read more about the [features](./guide.features.md) however, the below is a good representation of how Buttery Commands abstracts away the architectural and organization complexity so you can focus on just writing your commands.

## Requirements

Out of the need rose a few basic requirements.

### Improve the DX

As mentioned above, the DX of a lot of existing tools are good, but they can be better. The aim was to borrow off of conventions that have been popularized other projects (looking at you meta-frameworks) that have a significantly documented DX improvement and apply them to this project.

### Don't re-invent the wheel

Packages such as [Commander](https://github.com/tj/commander.js) offer a ton of features to be able to customize how CLI arguments and options are parsed and surfaced as well as provide some very helpful out of the box features such as auto documentation. There's no need to re-create what has already been proven to be a massively successful project, but instead to continue to expand on simplifying the the interface into it.

### Type-safety out of the box

This is a no-brainer. We're not here to re-stoke the fires of the TypeScript vs Javascript holy war, but instead to provide the highest level of confidence that the "stuff you write is just going to work". Part of enabling that is to provide type-safety out of the box; which in this case makes TS a first class citizen.

### Modular design

ESModules burst onto the scene with the release of ES6 and have significantly evolved how we write JS/TS applications. It's become the defacto standard anytime you write JS/TS to write modules and then do your best to handle the "legacy" CommonJS. ButteryTools aims to make the authoring process as modular as possible and then remove a all of the building complexity away from the established conventions

## A Quick Example

Writing a command is as simple as adding a file or directory where the filename is the way you would instantiate the command. Let's say you wanted to run a command like the below and the name of your CLI is `future`.

```sh
yarn future build --debug --watch
```

Writing the command for this is simple.

```ts
// Filepath: ./buttery/commands/build.ts
import type {
  CommandAction,
  CommandMeta,
  CommandOptions,
} from "@buttery/commands";

// The name and description of the command
// These properties are used to customize what is presented to the user when running the
// parent command or when running the command with a --help argument
export const meta: CommandMeta = {
  name: "build",
  description: "Build your library",
};

// The options that a consumer of the API can use to further customize
// the experience of the command
export const options: CommandOptions<"autofix" | "debug"> = {
  debug: {
    alias: "d",
    description: "Run the build command with more verbose logging",
    type: "boolean",
    required: false,
  },
  autofix: {
    alias: "af",
    description:
      "Prompts the user to add a description to any missing command files during the build process",
    type: "boolean",
    required: false,
  },
};

// A fully typed action that surfaces the options and args as objects
// that are inferred from the args and options exports respectively
export const action: CommandAction<typeof options> = async ({
  options,
  args,
}) => {
  if (options.debug) {
    LOG.level = "info";
  } else {
    LOG.level = "error";
  }

  try {
    await doSomethingReallyCoolWithASharedBuildFunction({
      watch: false,
      local: false,
    });
  } catch (error) {
    throw new Error(error as string);
  }
};
```
