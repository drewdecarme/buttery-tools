# @buttery/tokens

<!-- MONOWEAVE:BELOW -->

## @buttery/tokens (v0.1.11) <a name="0.1.11"></a>

Upgrades `@buttery/docs` to use ReactRouter v7. This changeset is important in order to support the ongoing major releases of React Router and eventually React 19.



## @buttery/tokens (v0.1.10) <a name="0.1.10"></a>

Upgrades dependencies to their latest versions. No breaking changes.



## @buttery/tokens (v0.1.7) <a name="0.1.7"></a>

This changeset primarily focuses on changing some of the logic to resolve the buttery directory in directory structures outside of the mono-repo. The logic was updated to look for a buttery directory each time a node_modules directory was located up the structure. Once it's found it then attempts to find the target that it was looking for.

In addition, a required configuration parameter was added to the script so the logLevel that was passed into into the script was then reflected in the `@buttery/core` logger. This allows us to debug the resolution of the buttery module at CLI runtime.



## @buttery/tokens (v0.1.3) <a name="0.1.3"></a>

Removes `changeset` and adds `monoweave` to be able to version, release and manage changelogs for the monorepo using yarn modern (yarn berry).

This changeset also adds some comments to the changelogs so `monoweave` has the ability to understand where it needs to add the changesets to each of the packages' changelogs.



## 0.1.1

### Patch Changes

- d8f4a0d: Changes all internal cross-references to exact references upon `npm publish`
- Updated dependencies [d8f4a0d]
  - @buttery/core@0.1.1

## 0.1.0

### Minor Changes

- 61f5b2e: Re-architects the repository to become a modular focused repo

  This changeset does a good deal of architecting to break the modules back out into their own packages. This ensures that all functionality associated with that particular tool is kept local to that package. A new package called `@buttery/core` has been added to easily distribute core modules to each of the `@buttery/tools`. These tools then use the core module to transpile, build, and distribute the local scripts externally.

  Another package called `@buttery/cli` has been created that should be installed alongside of whatever tool is desired to use. This ensures that we're not downloading too many dependencies and makes the CLI modules opt-in rather than a "nuts and bolts" approach.

### Patch Changes

- Updated dependencies [61f5b2e]
  - @buttery/core@0.1.0
