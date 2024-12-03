# @buttery/commands

<!-- MONOWEAVE:BELOW -->

## @buttery/commands (v0.4.7) <a name="0.4.7"></a>

Upgrades `@buttery/docs` to use ReactRouter v7. This changeset is important in order to support the ongoing major releases of React Router and eventually React 19.



## @buttery/commands (v0.4.6) <a name="0.4.6"></a>

Upgrades dependencies to their latest versions. No breaking changes.



## @buttery/commands (v0.4.2) <a name="0.4.2"></a>

This changeset removes some values from the `@buttery/commands` manifest due to misuse in CI. Previously the values that were generated in the manifest we're absolute strings which we're being malformed when generated in the CI runner.

The variables that were being created were file paths that were used to help reconcile the location of the runtime module that was created. This changeset removes the `pathSrc` and `pathOut` from the command manifest and adds `pathCmdModule` which is a relative path of the specific command module that is being used for that command.



## @buttery/commands (v0.4.1) <a name="0.4.1"></a>

This changeset fixes some bugs with the bundling and transpilation of the assets needed to be run from the CLI. It's another step to providing the full mono-repo stability while dog-fooding the rest of the application.

- `@buttery/builtins` - Adds full type-safety to the `inlineTryCatch` function
- `@buttery/cli` - Adds docs to the buttery tools documentation
- Organizes the docs in the CLI package
- `@buttery/core` - Changes the to resolve files using `NodeNext` which requires file extensions on imports. This allows the CLI to reference barrel imports as well as singular file imports while running in a purely node context.
- `@buttery/docs` - Re-loads the manifest and graph when files are added and changed by correctly invalidating the virtual modules.



## @buttery/commands (v0.4.0) <a name="0.4.0"></a>

Adds a new `@buttery/docs` API called `add` which allows you to either programmatically or via the `@buttery/cli` to add a new buttery doc by means of a few prompts.

```bash
buttery docs add <relative-path-to-.buttery/docs>
```

It has support for an optional boolean argument `--template, -t` to create the new doc based upon one of the [The Good Docs Project](https://www.thegooddocsproject.dev/template) templates.

```bash
buttery docs add <relative-path-to-.buttery/docs> --template
```



## @buttery/commands (v0.3.0) <a name="0.3.0"></a>

This changeset completely re-writes the `@buttery/commands` package from the ground up. Previously, the framework would look at a few directories, read some values and then create a `commander` program that would be built to the `bin` directory of the package that you we're working in.

Now, `@buttery/commands` no longer relies on `commander` to act as the runner and instead strips out a lot of the heavy packages to create a much lighter, leaner and more performant CLI framework. For starters, a static manifest is created every time you build your CLI. This offers a way more performant runtime where **all** of the validation is done at build time and the runtime is leaves it up to the implementer to log, throw, or validate the commands. In addition this also allows to create custom runtime's or deployment targets since the main sauce behind buttery commands it the compiled manifest.



## @buttery/commands (v0.2.3) <a name="0.2.3"></a>

Removes `changeset` and adds `monoweave` to be able to version, release and manage changelogs for the monorepo using yarn modern (yarn berry).

This changeset also adds some comments to the changelogs so `monoweave` has the ability to understand where it needs to add the changesets to each of the packages' changelogs.



## 0.2.1

### Patch Changes

- d8f4a0d: Changes all internal cross-references to exact references upon `npm publish`
- Updated dependencies [d8f4a0d]
  - @buttery/core@0.1.1

## 0.2.0

### Minor Changes

- e97b428: Adds a `components.export` script to select exports to copy into a directory of the user's choosing

  This changeset adds a new CLI command that allows the user to export any components inside of the `@buttery/components` package and output them to a directory of their choosing. This allows for the user to easily export the components that they see in the documentation and use in their own project and update as needed.

  This changeset also addresses some issues when trying to publish the packages to the NPM registry.

## 0.1.0

### Minor Changes

- 61f5b2e: Re-architects the repository to become a modular focused repo

  This changeset does a good deal of architecting to break the modules back out into their own packages. This ensures that all functionality associated with that particular tool is kept local to that package. A new package called `@buttery/core` has been added to easily distribute core modules to each of the `@buttery/tools`. These tools then use the core module to transpile, build, and distribute the local scripts externally.

  Another package called `@buttery/cli` has been created that should be installed alongside of whatever tool is desired to use. This ensures that we're not downloading too many dependencies and makes the CLI modules opt-in rather than a "nuts and bolts" approach.

### Patch Changes

- Updated dependencies [61f5b2e]
  - @buttery/core@0.1.0
