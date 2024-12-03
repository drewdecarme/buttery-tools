# Changelog

<!-- MONOWEAVE:BELOW -->

## @buttery/builtins (v0.1.8) <a name="0.1.8"></a>

Upgrades `@buttery/docs` to use ReactRouter v7. This changeset is important in order to support the ongoing major releases of React Router and eventually React 19.



## @buttery/builtins (v0.1.7) <a name="0.1.7"></a>

Upgrades dependencies to their latest versions. No breaking changes.



## @buttery/builtins (v0.1.6) <a name="0.1.6"></a>

This changeset fixes some bugs with the bundling and transpilation of the assets needed to be run from the CLI. It's another step to providing the full mono-repo stability while dog-fooding the rest of the application.

- `@buttery/builtins` - Adds full type-safety to the `inlineTryCatch` function
- `@buttery/cli` - Adds docs to the buttery tools documentation
- Organizes the docs in the CLI package
- `@buttery/core` - Changes the to resolve files using `NodeNext` which requires file extensions on imports. This allows the CLI to reference barrel imports as well as singular file imports while running in a purely node context.
- `@buttery/docs` - Re-loads the manifest and graph when files are added and changed by correctly invalidating the virtual modules.



## @buttery/builtins (v0.1.5) <a name="0.1.5"></a>

Adds a new `@buttery/docs` API called `add` which allows you to either programmatically or via the `@buttery/cli` to add a new buttery doc by means of a few prompts.

```bash
buttery docs add <relative-path-to-.buttery/docs>
```

It has support for an optional boolean argument `--template, -t` to create the new doc based upon one of the [The Good Docs Project](https://www.thegooddocsproject.dev/template) templates.

```bash
buttery docs add <relative-path-to-.buttery/docs> --template
```



## @buttery/builtins (v0.1.4) <a name="0.1.4"></a>

This changeset completely re-writes the `@buttery/commands` package from the ground up. Previously, the framework would look at a few directories, read some values and then create a `commander` program that would be built to the `bin` directory of the package that you we're working in.

Now, `@buttery/commands` no longer relies on `commander` to act as the runner and instead strips out a lot of the heavy packages to create a much lighter, leaner and more performant CLI framework. For starters, a static manifest is created every time you build your CLI. This offers a way more performant runtime where **all** of the validation is done at build time and the runtime is leaves it up to the implementer to log, throw, or validate the commands. In addition this also allows to create custom runtime's or deployment targets since the main sauce behind buttery commands it the compiled manifest.
