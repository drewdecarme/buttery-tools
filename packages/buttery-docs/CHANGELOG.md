# @buttery/docs

## 0.1.2

### Patch Changes

- d8f4a0d: Changes all internal cross-references to exact references upon `npm publish`
- Updated dependencies [d8f4a0d]
  - @buttery/components@0.1.1
  - @buttery/core@0.1.1
  - @buttery/meta@0.1.1

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

### Patch Changes

- Updated dependencies [61f5b2e]
  - @buttery/components@0.1.0
  - @buttery/core@0.1.0
  - @buttery/meta@0.1.0
