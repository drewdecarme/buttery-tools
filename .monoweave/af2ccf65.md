---
"@buttery/core": patch
---

This changeset changes the starting position of the search mechanism from a derived directory to the resolved buttery directory. This will allow the search mechanism to start directly at the buttery directory instead of somewhere else where it might actually miss the node_modules.
