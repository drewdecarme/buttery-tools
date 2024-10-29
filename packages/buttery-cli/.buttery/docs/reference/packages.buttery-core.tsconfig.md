---
title: "/tsconfig | Reference"
config:
  navBarDisplay: "/tsconfig"
---

# @buttery/core/tsconfig

A `@buttery/core` sub-path export that re-exports the `@buttery/tsconfig` package.

## Purpose

Consolidates the dependency list in any of the `@buttery/tools` packages.

## Installation

```bash
yarn add @buttery/core
```

### Usage

#### in `*.ts`

```ts
import tsconfig from "@buttery/core/tsconfig";
```

#### in `package.json`

```json
{
  "extends": "@buttery/core/tsconfig"
}
```

### API & Reference

[See the `@buttery/tsconfig` documentation](./packages.buttery-core.tsconfig.md)
