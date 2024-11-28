---
title: Buttery Commands
---

# Buttery Commands

Welcome to the Buttery Commands documentation!

## What is Buttery Commands?

Buttery Commands as a Typescript CLI framework with superior developer ergonomics. You create files in a directory with a 4 exports to create & configure your command and that's it. Full Stop.

```ts
// /.buttery/commands/parse.ts
import {
  type CommandAction,
  type CommandMeta,
  defineArgs,
  defineOptions,
} from "@buttery/commands";

// Define the name and description
export const meta: CommandMeta = {
  name: "parse",
  description: "Parse a file using a super duper parser.",
};

// Add some positional args
export const args = defineArgs({
  path: {
    type: "string",
    name: "path",
    description: "The path of the command to parse",
    required: true,
  },
});

// Add some options
export const options = defineOptions({
  debug: {
    type: "boolean",
    description: "Debug any output by printing out the logs to the terminal",
    alias: "t",
  },
});

// Export an action to run when the command is called. Pass args and options as
// generics to allow TS to easily infer the shape and type of them
export const action: CommandAction<typeof args, typeof options> = (params) => {
  console.log("Hello from the parse command.", args.path, options.debug);
};
```

### Let's go a bit deeper

Under the hood, Buttery Commands takes care of all of the tooling needed to transpile, bundle and then distribute your CLI. This allows you to on **intuitively** writing a complex CLI with arguments, options and sub-commands without having to worry about tooling, structure or a complex API.

Buttery Commands takes it's inspiration after JS/TS Meta Frameworks like Next.js, Remix, etc... Routing has been standardized and simplified down to a file-based routing system where your files are your routes. Buttery Commands takes the same aim where your **files are your commands**.

Whether your creating a simple CLI for tooling or a complex one for a serverless edge runtime, Buttery Commands can help you a build and scale complex, interactive and fast CLIs.

## Main Features

Some of the main features in Buttery Commands include:

| Feature              | Description                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Command Hierarchy    | A flat-file system based command / sub-command structure where your file names are the names of your commands.                                                                 |
| Static Exports       | Your command / sub-command can export up to 4 statically typed files to declaratively add meta data, positional args, options and actions to your command. All 100% type-safe. |
| Super fast builds    | A blazing fast build that uses esbuild to create a manifest to recursively build, read, and parse your command files in milliseconds                                           |
| Hot-reloading        | Make changes and see them instantly. No stopping an re-starting the development script                                                                                         |
| Tiny Runtime         | A incredibly default small runtime that can be used or substituted for another runtime of the users choice.                                                                    |
| Automatic Help Menus | An auto-generated help menu based upon best practices for each command                                                                                                         |
| Typescript           | Typescript is a first class citizen. All files are written in TS to provider a superior DX.                                                                                    |
