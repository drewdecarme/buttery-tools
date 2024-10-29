---
title: "/utils | Reference"
config:
  navBarDisplay: "/utils"
---

# @buttery/core/utils

A `@buttery/core` sub-path export that exposes a collection of utilities that are needed in any `@buttery/tools` package to accomplish some common things like instituting type-guards, traversing directories, finding specific paths, etc...

## Purpose

Exposes some utilities to easily de-duplicate and accomplish simple yet repetitive tasks

## Installation

```bash
yarn add @buttery/core
```

### Usage

```ts
import { ... } from "@buttery/core/utils/browser"
import { ... } from "@buttery/core/utils/isomorphic"
import { ... } from "@buttery/core/utils/node"
```

## Subpath Exports

The below are the exports exposed from the library to help with reconciling the config and any
static files, directories, etc... needed to run other packages from the CLI.

There are currently 3 sub-path exports on the `@buttery/core/utils` sub-path;

| Export Namespace | Description                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `/browser`       | A collection of utilities to be used only in browser contexts that specifically use Browser APIs      |
| `/isomorphic`    | A collection of TS / JS utilities that can be used in any context (browser, node, js runtime, etc...) |
| `/node`          | A collection of utilities that can only be run in node contexts that specifically use Node APIs       |

You can read more about each specific utility below

> These are broken up like this to ensure that any export out of the namespace barrel file doesn't throw a runtime error. For instance, a barrel file that exports a utilities that uses node built-ins will throw an error if that same barrel file is used to run a function in the browser. These subpath exports keep some separation of concerns intact when importing a collection of utils.

### `/browser`

No utilities at the moment

### `/isomorphic.exhaustiveMatchGuard`

Used at the end of a switch statement to ensure that all options in that switch statement have been exhausted.

```ts
import { exhaustiveMatchGuard } from "@buttery/core/utils/isomorphic";

type options = "option-1" | "option-2";

const discriminatedUnion = [
  { type: "option-1", determination: "stuff" },
  { type: "option-2", outcome: "stuff" },
];

function doSomething() {
  switch (discriminatedUnion) {
    case "option-1":
      // access to discriminatedUnion.determination
      return;

    case "option-2":
      // access to discriminatedUnion.outcome
      return;

    default:
      // will throw a type error if not all options have a case statement
      return exhaustiveMatchGuard(discriminatedUnion);
  }
}
```

### `/isomorphic.generateGUID`

A utility to generate a GUID devoid of the node `crypto` module or the `document.crypto` API. Ensures that GUIDs can be created in both context's regardless of browser or node support.

```ts
import { generateGUID } from "@buttery/core/utils/isomorphic";

const guid = generateGUID();
```

### `/isomorphic.kebabToCamel`

Formatting utility to convert `kebab-case-strings` into `camelCaseStrings`

```ts
import { kebabToCamel } from "@buttery/core/utils/isomorphic";

const camelCase = kebabToCamel("kebab-to-camel");
console.log(camelCase); // kebabToCamel
```

### `/isomorphic.kebabToPascalCase`

Formatting utility to convert `kebab-case-strings` into `PascalCaseStrings`

```ts
import { kebabToPascalCase } from "@buttery/core/utils/isomorphic";

const pascalCase = kebabToPascalCase("kebab-to-pascal");
console.log(pascalCase); // KebabToPascal
```

### `/node.findDirectoryUpwards`

Recursively searches up the directory tree to find a folder with a specific name, and if found, checks for a nested directory within it.

This is extremely helpful when attempting to reconcile the location of specific static directories that have been published along with the distribution files of any buttery tool.

**Assuming the following directory structure:**

```txt
/home/user/project/

├── node_modules
│   └── nestedDir
├── src
│   └── index.js
└── package.json
```

If the current working directory is `/home/user/project/src`
and we search for `node_modules` and `nestedDir`, the function will return:

```ts
import { findDirectoryUpwards } from "@buttery/core/utils/node";

const result = findDirectoryUpwards("node_modules", "nestedDir");
console.log(result); // /home/user/project/node_modules/nestedDir
```

### `/node.hashString`

Takes a string and returns a hashed representation of that string. This is done to provide a significantly unique temp directory for caching and serving a `.buttery/config` file.

```ts
import { hashString } from "@buttery/core/utils/node";

const hash = hashString("hash-this-string");
console.log(hash);
//721aa8312cd14ea4edbc905c6aba6c92b3611198d9c219992360175286b7f24a
```

### `/node.parseAndValidateOptions`

This function takes in a schema, some input data that should be validated
against that `zod` schema and a logger to parse and validate the options that
are passed into any function. This is intended to easily validate that required
options exist as well as validate that they're well formed at runtime. In addition,
defaults can easily be defined using teh `Zod` schema that is passed to the function.

This is one stop shop for ensuring that the options that are passed into
a function are well formed and properly defaulted. This ostensibly turns functional option
reconciliation and defaulting into a one liner.

> This is designed to help reconcile options that need to be passed from the `@buttery/cli > @buttery/_tool_`

In the example below, if the options aren't valid, it will throw a well formatted error and not continue.

```ts
import { ButteryLogLevelSchema, ButteryLogger } from "@buttery/core/logger";
import { z } from "zod";
import { parseAndValidateOptions } from "@buttery/core/utils/node";

// create a LOG instance
export const LOG = new ButteryLogger({
  id: "buttery-example",
  prefix: "buttery:example",
  prefixBgColor: "#812c8d",
  logLevel: "debug",
});

// Define the schema
const optionsSchema = z.object({
  /**
   * The level of detail the logs should be displayed at
   * @default info
   */
  logLevel: ButteryLogLevelSchema.default("info"),
  /**
   * If the required folder structures don't exist, display
   * prompts to create them / re-align them instead of
   * throwing errors
   * @default true
   */
  prompt: z.boolean().default(true),
});

// infer the type from the options
export type BuildOptions = Partial<z.infer<typeof optionsSchema>>;

export async function build(options?: BuildOptions) {
  // parse the options
  const parsedOptions = parseAndValidateOptions(optionsSchema, options, LOG);

  // use the options
  LOG.level = parsedOptions.logLevel;

  // ... run more things
}
```
