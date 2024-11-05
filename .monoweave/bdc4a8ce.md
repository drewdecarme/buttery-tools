---
"@buttery/cli": patch
"@buttery/commands": patch
"@buttery/components": patch
"@buttery/core": patch
"@buttery/docs": patch
"@buttery/icons": patch
"@buttery/logs": patch
"@buttery/meta": patch
"@buttery/tokens": patch
"@buttery/tsconfig": patch
"eslint-config-buttery": patch
---

Removes `changeset` and adds `monoweave` to be able to version, release and manage changelogs for the monorepo using yarn modern (yarn berry).

This changeset also adds some comments to the changelogs so `monoweave` has the ability to understand where it needs to add the changesets to each of the packages' changelogs.
