# eslint-config-buttery

<!-- MONOWEAVE:BELOW -->

## 0.1.0

### Minor Changes

- 61f5b2e: Re-architects the repository to become a modular focused repo

  This changeset does a good deal of architecting to break the modules back out into their own packages. This ensures that all functionality associated with that particular tool is kept local to that package. A new package called `@buttery/core` has been added to easily distribute core modules to each of the `@buttery/tools`. These tools then use the core module to transpile, build, and distribute the local scripts externally.

  Another package called `@buttery/cli` has been created that should be installed alongside of whatever tool is desired to use. This ensures that we're not downloading too many dependencies and makes the CLI modules opt-in rather than a "nuts and bolts" approach.

## 0.0.2

### Patch Changes

- 2c16c46: ## v0.0.1 - Bootstraps all of the tools together; initial baseline

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
