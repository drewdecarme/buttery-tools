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

WIP

## Todos

- Create `dev` scripts for writing the CLI
- Create `dev` CLI command for developing
- Create `build` CLI Command building
- Finish hard typing the `options` and `args` based upon the command file
- Semantic release
- Add `init` command to ensure a commands directory is there and some other things
