# Changelog

<!-- MONOWEAVE:BELOW -->

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
