# @buttery/core

<!-- MONOWEAVE:BELOW -->

## @buttery/core (v0.1.8) <a name="0.1.8"></a>

This changeset changes the starting position of the search mechanism from a derived directory to the resolved buttery directory. This will allow the search mechanism to start directly at the buttery directory instead of somewhere else where it might actually miss the node_modules.



## @buttery/core (v0.1.7) <a name="0.1.7"></a>

This changeset primarily focuses on changing some of the logic to resolve the buttery directory in directory structures outside of the mono-repo. The logic was updated to look for a buttery directory each time a node_modules directory was located up the structure. Once it's found it then attempts to find the target that it was looking for.

In addition, a required configuration parameter was added to the script so the logLevel that was passed into into the script was then reflected in the `@buttery/core` logger. This allows us to debug the resolution of the buttery module at CLI runtime.



## @buttery/core (v0.1.6) <a name="0.1.6"></a>

This changeset fixes some bugs with the bundling and transpilation of the assets needed to be run from the CLI. It's another step to providing the full mono-repo stability while dog-fooding the rest of the application.

- `@buttery/builtins` - Adds full type-safety to the `inlineTryCatch` function
- `@buttery/cli` - Adds docs to the buttery tools documentation
- Organizes the docs in the CLI package
- `@buttery/core` - Changes the to resolve files using `NodeNext` which requires file extensions on imports. This allows the CLI to reference barrel imports as well as singular file imports while running in a purely node context.
- `@buttery/docs` - Re-loads the manifest and graph when files are added and changed by correctly invalidating the virtual modules.



## @buttery/core (v0.1.4) <a name="0.1.4"></a>

This changeset completely re-writes the `@buttery/commands` package from the ground up. Previously, the framework would look at a few directories, read some values and then create a `commander` program that would be built to the `bin` directory of the package that you we're working in.

Now, `@buttery/commands` no longer relies on `commander` to act as the runner and instead strips out a lot of the heavy packages to create a much lighter, leaner and more performant CLI framework. For starters, a static manifest is created every time you build your CLI. This offers a way more performant runtime where **all** of the validation is done at build time and the runtime is leaves it up to the implementer to log, throw, or validate the commands. In addition this also allows to create custom runtime's or deployment targets since the main sauce behind buttery commands it the compiled manifest.



## @buttery/core (v0.1.3) <a name="0.1.3"></a>

Removes `changeset` and adds `monoweave` to be able to version, release and manage changelogs for the monorepo using yarn modern (yarn berry).

This changeset also adds some comments to the changelogs so `monoweave` has the ability to understand where it needs to add the changesets to each of the packages' changelogs.



## 0.1.1

### Patch Changes

- d8f4a0d: Changes all internal cross-references to exact references upon `npm publish`
- Updated dependencies [d8f4a0d]
  - @buttery/logs@0.1.1

## 0.1.0

### Minor Changes

- 61f5b2e: Re-architects the repository to become a modular focused repo

  This changeset does a good deal of architecting to break the modules back out into their own packages. This ensures that all functionality associated with that particular tool is kept local to that package. A new package called `@buttery/core` has been added to easily distribute core modules to each of the `@buttery/tools`. These tools then use the core module to transpile, build, and distribute the local scripts externally.

  Another package called `@buttery/cli` has been created that should be installed alongside of whatever tool is desired to use. This ensures that we're not downloading too many dependencies and makes the CLI modules opt-in rather than a "nuts and bolts" approach.

### Patch Changes

- Updated dependencies [61f5b2e]
  - @buttery/logs@0.1.0
