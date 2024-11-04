# @buttery/cli

## 0.2.1

### Patch Changes

- d8f4a0d: Changes all internal cross-references to exact references upon `npm publish`

## 0.2.0

### Minor Changes

- e97b428: Adds a `components.export` script to select exports to copy into a directory of the user's choosing

  This changeset adds a new CLI command that allows the user to export any components inside of the `@buttery/components` package and output them to a directory of their choosing. This allows for the user to easily export the components that they see in the documentation and use in their own project and update as needed.

  This changeset also addresses some issues when trying to publish the packages to the NPM registry.

## 0.1.2

### Patch Changes

- 5952408: Adds development dependencies to complete build

  The `@buttery/cli` needed the `@buttery/docs` dependency to correctly build the docs

## 0.1.1

### Patch Changes

- fa36ab7: Pattern matches the route against the manifest to serve the correct static assets

  This changeset adjusts the ordering of how the production request is handled in the cloudflare functions directory when you deploy a `@buttery/docs` application to Cloudflare Pages. Previously, the handler was searching for a specific namespace which led to the exclusion of specific assets (in the bugs case images). Instead, the handler now attempts to match the pathname against the buttery manifest which in turns tries to render the SSR app first instead of the other way round.

  ```ts
  // Get only the route paths
  const routes = Object.values(bManifest).map(
    (manifestEntry) => manifestEntry.routePath
  );

  // try the route first
  if (routes.includes(pathname)) {
    try {
    } catch {}
  }

  // try the asset fetcher last
  try {
    const asset = await context.env.ASSETS.fetch(context.request);
    return asset;
  } catch (error) {
    console.error(`Error serving static file: ${pathname}`, error);
    return new Response("Not Found", { status: 404 });
  }
  ```

  If the path doesn't match anything in the buttery manifest we fallback to trying to render any static assets that we're included in the client build. Eventually we throw a 404 if we can't find anything and a 500 of the route doesn't render correctly.

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
