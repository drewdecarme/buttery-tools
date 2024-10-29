---
title: "/builder | Reference"
config:
  navBarDisplay: "/builder"
---

# @buttery/core/builder

A `@buttery/core` sub-path export that uses [esbuild](https://esbuild.github.io/) to quickly and consistently transpile and bundle any of the `@buttery` tools or supporting libraries to be used for consumption either via import or via the `@buttery/cli`.

## Purpose

To create a consistent and minified build of any of the buttery packages so they could easily be used in the [`@buttery/cli`](./packages.buttery-cli.md).

> Typically, we wouldn't need to bundle but it's important that we do to ensure that we can run this code using a shebang in our CLI. When TypeScript builds the project, it can easily reason about the endings on a file so importing a file like the `import { someFunction } from "./some-function"` works fine, but when running the code using a shebang, node cannot reason about the line endings and it specifically needs the `.js` extension. Bundling the necessary files together ensures that the script can be run in both contexts.

## Installation

```bash
yarn add @buttery/core
```

### Usage

```ts
import { ... } from "@buttery/core/builder"
```

## API

There are 2 ways to run the builder and for 2 very distinct purposes.

1. Build and bundle the **_scripts_** needed to be _run_ in the CLI
2. Build and bundle the **_library_** needed to be _used_ in the CLI

The builder should only be used to build some of the various `@buttery` tools packages, it makes a few assumptions about the directory structure as well as the names of the files it's looking for.

#### Why esbuild instead of `tsc`?

Node can't resolve any imports that don't have their extensions (unless you enable a feature flag per platform). So in order to ensure that we do away with that without completely changing our TSConfig, we bundle them together so all of the necessary code is in one file that can be run using a shebang.

### Build _scripts_ for the CLI

The builder looks for any files in the `/src/cli-scripts` directory. This convention is the way that it is since the scripts that are being built are _runnable_, meaning they should be runnable in the CLI or independently elsewhere.

So if we had a CLI that wanted to run a `dev` command from our package, the convention would be `/src/cli-scripts/dev.ts`.

Consider the below structure:

```ts
|- scripts/
  |- scripts.build.ts
|- src/
  |- cli-scripts/
    |- dev.ts
    |- build.ts
    |- format.ts
```

In order to build the scripts, we create a `scripts/scripts.build.ts` file that will look like the below:

```ts
// scripts/dist.build.ts
import { build } from "@buttery/core/builder";

build({ mode: "cli-scripts" });
```

When we run this script using `tsx` from the `package.json` using `yarn`, the `@buttery/core/builder` will find all 3 of the scripts located in the `src/cli-scripts` directory, build and bundle them independently into the `/dist` directory.

### Build a _library_ for the CLI

There might be times where we are bundling a library together that doesn't have any scripts to run it, but still needs to be bundled in order to work in the CLI.

For instance, `@buttery/core` is used in almost every single one of the `@buttery/tools` scripts so it needs to have itself bundled as well. In this case, we use the `@buttery/core/builder` to build a library into the `dist` directory rather than looking for a specific convention.

Due to this reason, the builder doesn't make any assumptions about the folder structure of the package. Instead it just requires an array of entry points in which to build.

```ts
|- src/
  |- index.ts
|- scripts/
  |- library.build.ts
```

```ts
// scripts/library.build.ts
import path from "node:path";
import { build } from "@buttery/core/builder";

build({ mode: "loose" entryPoints: [path.resolve(import.meta.dirname, "../src/index.ts")]});
```

We simply define an entry point of what we want to build it bundles and build's it into the `/dist` directory when use `tsx` to run the `scripts/library.build.ts` file.
