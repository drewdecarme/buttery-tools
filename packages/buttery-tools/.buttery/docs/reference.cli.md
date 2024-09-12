---
title: CLI Reference
---

# ClI Reference

## `commands`

The ancestor command that houses all of the sub-commands required to run and build a Buttery Commands CLI.

### `commands.build`

### `commands.create-command` (WIP)

### `commands.dev`

### `commands.init` (WIP)

## `docs`

The ancestor command that houses all of the sub-commands required to develop, parse, and build a Buttery Docs documentation website.

### `buttery docs dev` (WIP)

Start the ButteryDocs dev server

#### Usage

```sh
yarn buttery docs dev
```

#### Options

| Options           | Description                                     | Default |
| ----------------- | ----------------------------------------------- | ------- |
| `--config [path]` | The path of the config                          | others  |
| `--no-init`       | Opts out of initial directory and file creation | `false` |

### `buttery docs build` (WIP)

### `buttery docs format` (WIP)

An interactive command (can be bypassed with options) that provides you the ability to do some formatting on the files in the `/.buttery/docs` folder in your project.

#### Usage

```sh
yarn buttery docs format
```

#### Options

| Options           | Description                                                                                | Options        |
| ----------------- | ------------------------------------------------------------------------------------------ | -------------- |
| `--selection, -s` | Bypasses the interactive prompts and immediately selects the item you would like to format | `"navigation"` |

If no options are provided, an interactive prompt will appear that will allow you to select what you want to do with the formatter.

##### Navigation (WIP)

TODO: Add the option to bypass the interactive menu

```sh
yarn buttery docs format --selection=navigation
```

This option will read and parse all of the files in the `/.buttery/docs/` directory and do it's best to organize the files in a way that makes sense. This is a great command for when you're writing a lot of documentation really fast or you wrote a lot of docs and you haven't ordered them yet in your `/.buttery/config.ts` file.

This command will output a stringified JSON that can be pasted into the `docs.order` key in the `/.buttery/config.ts` file. Below is a sample of that output.

```txt
[3:14:34 PM] [@buttery/docs] ⦿ watching Formatting...
? What would you like to format? Navigation
[3:14:35 PM] [@buttery/docs] ✓ success Successfully auto ordered the documentation files.

Results of the auto order are below.
You can take it and paste it into the "./.buttery/config.ts", "docs.order" key.
----

{
  "guide": {
    "display": "Guide",
    "routeOrder": [
      "guide",
      "routing",
      "features",
      "getting-started",
      "writing-a-command",
      "why-buttery-commands"
    ]
  },
  "reference": {
    "display": "Reference",
    "routeOrder": [
      "config"
    ]
  }
}

----
```

After you paste it in, you can use this to then re-order your routes in the guide and reference sections.

### `buttery docs init` (WIP)

### `buttery docs lint` (WIP)

Runs through all of your docs and ensures that they contain the minimum frontmatter to ensure that SEO, Navigation links, etc... exists and is populated to create a well formed and accessible documentation site.

## `tokens`

### `tokens.dev` (WIP)

### `tokens.build` (WIP)

## `help`
