---
title: Creating multiple token sets
---

# Creating multiple token sets

- Add the tokens as an array

```ts
export type ButteryConfig = {
  commands?: ButteryConfigCommands;
  tokens?: ButteryConfigTokens | ButteryConfigTokens[];
  docs?: ButteryConfigDocs;
};
```

- Break it up in the config

```txt
.buttery/
  |-- config.ts
  |-- config.tokens.docs.ts
  |-- config.tokens.playground.ts
```

```ts
// ./buttery/config.tokens.docs.ts
export const ConfigTokensDocs: ButteryConfigTokens = {
  importName: "docs",
  // ...restConfig,
};
```

```ts
// ./buttery/config.tokens.playground.ts
export const ConfigTokensDocs: ButteryConfigTokens = {
  importName: "playground",
  // ...restConfig,
};
```

```ts
// ./buttery/config.ts
import type { ButteryConfig } from "@buttery/core";
import { ConfigTokensDocs } from "./config.tokens.docs";
import { ConfigTokensPlayground } from "./config.tokens.playground";

const config: ButteryConfig = {
  //   ...restConfig,
  tokens: [ConfigTokensDocs, ConfigTokensPlayground],
};
export default config;
```
