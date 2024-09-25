---
"@buttery/tools": minor
---

## v0.0.1 - Bootstraps all of the tools together; initial baseline

### Overview

This release is focused on providing a baseline for stability of all of the tools. The changes in this release are focused mainly on convention, repository architecture and establishing a working mental model for how all of the tools are written and then dogfood-ed using each other.

### What's Changed

#### Single package for CLI & tool artifacts

Previously, there we're several directories / packages that installed the `@buttery/cli` and then could be installed. Instead, this changeset refactors all of that where there are no longer different independent packages, but now only one called `@buttery/tools`. This does a few things:

1. Reduces the number of inter-dependencies
2. Reduces the number of packages that need to be installed
3. Simplifies the architecture where a binary is created and published along with accompanying artifacts to be used as static files to create development apps, generate templates, etc...

### Deprecated

All packages have been deprecated, removed from npm and have been replaced with one single package that contains the CLI as well as

### Removed

All of the below directories and packages have been removed in favor of one publishable and installable package `@buttery/tools`

- `packages/buttery-cli`
- `packages/buttery-components`
- `packages/buttery-tokens`
- `packages/buttery-docs`
- `packages/buttery-tsconfig`
- `packages/buttery-utils`
