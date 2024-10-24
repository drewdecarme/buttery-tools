---
title: "@buttery/tsconfig | Reference"
config:
  navBarDisplay: "@buttery/tsconfig"
---

# @buttery/tsconfig

A core package that exposes some pre-defined `tsconfig`s to make it easy to consistently refer to a central config that can then be built upon depending upon the use case.

## Installation

```bash
yarn add @buttery/tsconfig
```

## Usage

```json
// tsconfig.json
{
  "extends": "@buttery/tsconfig/library"
}
```

## Dependencies

No `@buttery` intra-dependencies.

## Exports

### `tsconfig.library.json`

A common `tsconfig` that can be used as a baseline for creating TS libraries. This can also be utilized as a base tsconfig that then can be edited to fit the needs of the tsconfig that governs that specific part of a repository.

```json
// tsconfig.json
{
  "extends": "@buttery/tsconfig/library"
}
```

## Scripts

No scripts needed for this library. This library exports pure JSON that is easily imported using this packages `exports` field in the `package.json`
