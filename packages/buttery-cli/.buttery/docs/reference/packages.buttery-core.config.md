---
title: "/config | Reference"
config:
  navBarDisplay: "/config"
---

# @buttery/core/config

A `@buttery/core` sub-path export that helps the buttery tools packages reconcile and load the `.buttery/config`.
It exposes a few helper utilities and their type definitions to make it easy to locate, use and reason about the keys and
values in the configuration file.

## Purpose

Makes it easy to locate, evaluate and then read any values in the `.buttery/config` file.

## Installation

```bash
yarn add @buttery/core
```

### Usage

```ts
import { ... } from "@buttery/core/config"
```

## API

The below are the exports exposed from the library to help with reconciling the config and any
static files, directories, etc... needed to run other packages from the CLI.

### `getButteryConfig`

Searches for the `.buttery/config` file either from the current working directory
or from a provided directory. Attempts to resolve a few directories and
configurations based upon that search. Once found, it builds the configuration
using Esbuild and then resolves the configuration as an ESModule to be used
in any of the commands in the CLI.

#### Fetching a specific key and values

Since we're primarily fetching the config for one command at a time, you should include
required parameter of the key that you wish to retrieve from the config.

The below value will retrieve the docs

```ts
import { getButteryConfig } from "@buttery/core";

const docsConfig = getButteryConfig("docs");
```

#### Return Values

The function returns an object with 2 keys:

1. The key of the desired key listed in the params
2. A `paths` key that has a few paths that can be used to access the cache (`.store` as we call it).

The type signatures are included below for your convenience.

```ts
// ReturnType<typeof getButteryConfig>

type ButteryConfigWithPaths = {
  config: ButteryConfig;
  paths: ButteryConfigPaths;
};

type ButteryConfigPaths = {
  config: string;
  butteryDir: string;
  storeDir: string;
  rootDir: string;
};

type ButteryConfigPaths = {
  config: string;
  butteryDir: string;
  storeDir: string;
  rootDir: string;
};
```

### `getNodeModulesButteryOutputDir`

Searches up the directory structure starting at the package root
which is one directory up from the `.buttery` directory. It will
attempt to find the `node_modules` directory that has the scoped
`@buttery` directory inside of it. If it doesn't find the scoped
directory, it will continue searching up the directory structure
until it finds it.

```ts
const config = getButteryConfig("tokens"); // as ResolvedButteryConfig<"tokens">

const nodeModulesTokenDir = await getNodeModulesButteryOutputDir(
  config.paths,
  "tokens"
);
```

The above fetches the config then the `config.paths` value can be used
to search for the nearest `node_modules` directory that contains the `@buttery/tokens`
package.

> This function is crucial in locating the necessary static artifacts
> required to copy files, run apps, etc... from the CLI.

## Reference

### Config Reconciliation Process

The [`getButteryConfig`](#getbutteryconfig) function does the following in order to return a completely transpiled and reconciled configuration:

1. Reconciles some options with defaults
2. Searches for the `.buttery/config` file from a starting directory or `cwd`.
3. Creates a `.buttery/.store` directory to cache and well, store stuff.
4. Transpiles the configuration from TS into JS. Once transpiled a virtual module is created to parse and then read the transpiled file as an ESModule.
5. The return values are constructed and the specifically requested key is located and returned.
