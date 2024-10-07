import { buildButteryTokens } from "../utils/tokens.buildButteryTokens";

// TODO: Add some public options
export async function dev() {
  await buildButteryTokens({
    debug: true,
    interactive: false,
    prompt: true,
    watch: true,
    isLocal: false,
  });
}
