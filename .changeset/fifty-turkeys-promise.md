---
"@buttery/commands": minor
"@buttery/cli": minor
---

Adds a `components.export` script to select exports to copy into a directory of the user's choosing

This changeset adds a new CLI command that allows the user to export any components inside of the `@buttery/components` package and output them to a directory of their choosing. This allows for the user to easily export the components that they see in the documentation and use in their own project and update as needed.

This changeset also addresses some issues when trying to publish the packages to the NPM registry.
