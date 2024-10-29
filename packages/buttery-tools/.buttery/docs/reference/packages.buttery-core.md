---
title: "@buttery/core | Reference"
config:
  navBarDisplay: "@buttery/core"
---

# @buttery/core

A core package that supplies a lot of the base and shared functionality needed to create any of the `@buttery/tools`. This package contains a very specific sub-path exports to supply that functionality and a modular way. Those sub-path exports export utilities, types, etc... to make it easy to develop, bundle, distribute and then subsequently consume any of the `@buttery` tools.

> **NOTE**: It's worth noting that the sole purpose of this package is to simplify the mono-repo structure as well as provide 1 single package that is needed for any `@buttery` tool development. This package is **not individually usable** and is not considered a buttery tool.

## Installation

```bash
yarn add @buttery/core
```

## Purpose

Provider a central place to:

- Makes it easy to locate, evaluate and then read any values in the `.buttery/config` file.
- Utilize a shared `tsconfig.json` for all projects
- Employ the use of a few common utilities for directory searching, asset management, static file serving, etc...
- Build and bundle any scripts needed to supply the `@buttery/cli` its commands.

## Dependencies

| Package                                               | Type          | Purpose                                                                 |
| ----------------------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| [`@buttery/tsconfig`](./packages.buttery-tsconfig.md) | devDependency | Shared TSConfig for `@buttery` library development                      |
| [`@buttery/logger`](./packages.buttery-logger.md)     | dependency    | Isomorphic logging utiltity to easily debug and trace any functionality |

## Subpath Exports

The below sections are the sub-path exports that allow consumers of `@buttery/core` to import and utilize it's modules.

| Subpath                                          | Description                                                                                                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`/config`](./packages.buttery-core.config.md)   | Exports utilities & types that makes it easy to locate, evaluate and then read any values in the `.buttery/config` file.                                                                   |
| [`/builder`](./packages.buttery-core.builder.md) | Exposes a `build` function that will create a consistent and minified build of any of the buttery packages so they could easily be used in the [`@buttery/cli`](./packages.buttery-cli.md) |
| [`/utils`](./packages.buttery-core.builder.md)   | Exposes a smaller sub-paths to expose some utilities to assist with traversing directories, type guarding etc... to help build the `@buttery/tools`                                        |
| [`/tsconfig`](./packages.buttery-core.config.md) | Re-exports the `@buttery/tsconfig` package                                                                                                                                                 |
| [`/logger`](./packages.buttery-core.config.md)   | Re-exports the `@buttery/logger` package                                                                                                                                                   |

## Scripts

The below commands are defined in the `package.json` to help develop, build and distribute the package.

### `yarn build`

A single script that is run during monorepo build that runs a series of other sub:build scripts. Each `sub:build` script
is denoted by at `:` (colon).

### `yarn lib:build`

Runs the `scripts/lib.build.ts` file that executes the `@buttery/core/builder` to transpile and bundle the necessary files used to reconcile the configuration file at runtime.

The `@buttery/core/builder` package is used here to bundle all of the files needed to run the utilities together to ensure that the utilities can be used in a TS package as well as a node binary for CLI use.

> Typically, we wouldn't need to bundle but it's important that we do to ensure that we can run this code using a shebang in our CLI. When TypeScript builds the project, it can easily reason about the endings on a file so importing a file like the `import { someFunction } from "./some-function"` works fine, but when running the code using a shebang, node cannot reason about the line endings and it specifically needs the `.js` extension. Bundling the necessary files together ensures that the script can be run in both contexts.

### `yarn lib:types`

Runs the typescript compiler to export the types, declarations, and mapping files needed to import and run the utilities exported from the library.
