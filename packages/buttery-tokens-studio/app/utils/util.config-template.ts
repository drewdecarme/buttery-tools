export function wrapConfig(config: string) {
  return `import { defineTokensConfig } from "@buttery/tokens";

export default defineTokensConfig(${JSON.stringify(config, null, 2)});
`;
}
