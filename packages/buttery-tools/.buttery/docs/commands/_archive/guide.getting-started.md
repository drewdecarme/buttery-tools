---
title: Getting Started
---

# Getting Started

## Overview

Buttery Commands is a modular, file / directory based way to write simple and easily ingestible NodeJS CLIs. This package doesn't intend to be anything other than a significant improvement on top of already established and widely accepted ways of parsing, interpreting, running and documenting a node CLI.

At its core, Buttery Commands follows the below process to create your CLI:

1. **Read and Parse the command files** - It uses the [Buttery CLI]() to read and parses the files in the `.buttery/commands` directory.
2. **Create a CommanderJS CLI Program** - It then creates a [CommanderJS](https://github.com/tj/commander.js) program from those parsed files using the conventions established in the package.
3. **Only loads and runs code it needs to** - It uses ESModules to dynamically only run the files needed for the command that is being instantiated.

## Installation

Download the package from the NPM registry.

```bash
# npm
npm install @buttery/commands --dev

# yarn
yarn add @buttery/commands --dev
```

When you download the `@buttery/commands` package you're also downloading the `@buttery/cli` which is written using `@buttery/commands`.

> As a quick aside, `@buttery/commands` is dog-fooded by the `@buttery/cli`. The CLI is written and built with the same development and build functions that are exposed to the `buttery commands build|dev` CLI commands. This ensures that the `@buttery/commands` package has all of the adequate functionality to easily write and release CLIs.

## Setup

There are two ways (as with most any CLI based package these days) to setup: automated & manual.

### Automated

You select from 1 of 2 methods to automatically setup your `@buttery/commands` project

#### `buttery commands init`

Probably the most straightforward way of setting up your project, the `init` command will run you through a few prompts in order to create the files and folders necessary to start your CLI.

```sh
yarn buttery commands init
```

#### `buttery commands dev`

This is a little more of a round-about way, but the `dev` command will always run some pre-flight checks to ensure that your project has all of the necessary files it needs in order to develop and subsequently build your CLI.

```sh
yarn buttery commands dev
```

### Manual

The below process will walk you through what you need to do to get started from nothing.

#### Create a configuration file

Create a `.buttery/config.ts` file at the path that you will run the CLI from.

```sh
# assuming your terminal is in the location of where your script will be run
mkdir ./.buttery && touch ./buttery/config.ts
```

> You can also provide this dynamically to the `buttery commands dev|build` command by supplying the `--config=/path/to/your/config` option to the command.

#### Add some basic properties

Copy the below into your configuration file and adjust any properties that you would like

```ts
import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  commands: {
    name: "future",
    description: "A furtueristic CLI",
    version: "0.0.1",
  },
};
export default config;
```

There are other configuration points for the config file. Feel free to check out those configuration options in the [Configuration Reference](./reference.config.md) documentation.

#### Write a basic command

Add a `test.ts` file in the `/.buttery/commands/` directory and copy the below into it.

## Next Steps

Now that you have a sample file, check out the the [Development Guide](guide.developing.md) to start run the development server and then the [Writing Commands Guide](./guide.writing-commands.md) to understand the full API of creating a command.
