<h1 align="center" style="padding-bottom: 30px">
  <img align="center" width="50%" src="./images/butter.png" style="margin: 0 auto;"/>
</h1 >

# Buttery CLI

A file-based mechanism (similar to Remix routes) for creating a fully typed and documented CLI.

## Description

This CLI tool simplifies the process of creating command-line interfaces (CLIs) by dynamically generating commands from files within a specified folder. It's designed to streamline CLI development by automating command creation, making it easy to define, develop, and build custom Typescript CLIs; all driven by established industry conventions.

This tool and mechanism abstracts away all of the complexity needed to create CLIs; from the hash-bangs to the `argv` processing... the Buttery CLI makes it dead simple to create complex CLIs at scale.

## Getting Started

### 1. Create a `butter.config.ts` config file

Add a file at the root of your repository. This adds some basic information about your CLI such as the name, description, and version.

```ts
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  name: "butter",
  description: "A buttery smooth CLI. Let's spread it on!",
  version: "0.0.1",
  root: path.resolve(__dirname),
};
```

### 2. Add command files in the `/commands` directory

The name of the file is the name of the command. The name is deliniated by a period which indicates a parent-command/sub-command relationship. In this case, our file name is `test.primary`:

- `test` - parent command
- `primary` - sub-command

```ts
// Filename: `commands/test.primary.ts`
import type {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "@buttery/cli";

// Some information about your command
export const meta: CommandMeta = {
  name: "data",
  description: "Cras mattis consectetur purus sit amet fermentum.",
};

export const options: CommandOptions = {
  background: {
    type: "value",
    alias: "b",
    description: "The color of a nebulous thing",
    required: false,
  },
  "should-load": {
    type: "boolean",
    alias: "sl",
    description: "If something should load",
    required: false,
  },
};

export const args: CommandArgs = [
  {
    name: "username",
    description: "user to login",
    required: true,
  },
  {
    name: "password",
    description: "password for user, if required",
    required: false,
  },
];

export const action: CommandAction<typeof args, typeof options> = async (
  params
) => {
  console.log(`Hello from the "test.primary" command.`, params);
};
```

### 3. Build your CLI

Build your CLI using the `butter cli build` command.

```bash
yarn butter cli build
```

### 3. Invoke your CLI

```bash
yarn butter test primary johndoe@domain.com pword --background=blue --should-load
```

#### Output

```txt
Hello from the "test.primary" command. {
  args: { username: 'johndoe@domain.com', password: 'pword' },
  options: { background: 'blue', shouldLoad: true }
}
```

## Conventions

### Directories

#### `/src`

Contains all of the files that are needed for the CLI builder to work. This would include utilities for parsing commands and any handlebars templates for dynamic config variable insertion and creation.

The functions and other things in this directory should only be accessible via the CLI and they should not be able to be imported when the cli builder is installed.

#### `/lib`

Contains all of the files that can be publicly imported when this package is installed using any package manager. This would include things like the `createConfig` function which will properly type and add intellisense to creating a `buttery.config.ts` file.

This directory is built using the TS compiler even though some files inside of this directory are used for the CLI commands like `build` and `dev`

#### `/types`

Contains all of the types that are used for both the `src` and `lib` files and will be added and exposed following the conventions set fourth in each directory.

#### `/scripts`

These are internal scripts that are invoked using this packages `package.json`. This allows for this package to share the `script.build.ts` file that is used both internally to this packages `commands` directory as well as for development of the build command. Essentially, having this script directory allows this package dog-food the `buttery cli build` command buy actually using it.

## Todos

### 1st Priority

- Combine all build scripts into esbuild script. Remove need for `tsc`
- All scripts must build the commands, entry file and `package.json`
- Create a `buttery.config.json[cli]` namespace to allow for configuration options for configuring the CLI builder.
- Create a `createConfig` function like `vite`

### 2nd Priority

- Create `dev` scripts for writing the CLI
- Create `dev` CLI command for developing
- Create `build` CLI Command building
- Finish hard typing the `options` and `args` based upon the command file
- Semantic release
- Add `init` command to ensure a commands directory is there and some other things
- Add an SEO command for creating a PWA manifest file
- Add an SEO command for creating favicon files
- Watch and entire directory instead of just some files so when a new command is added it's added to the build files
- Make a static build instead of runtime evaluation. The development errors surface when instantiating the CLI rather than when developing it.
