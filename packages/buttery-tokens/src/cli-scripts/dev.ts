import { buildButteryTokens } from "../buildButteryTokens";

// TODO: Add some public options
export function dev() {
  buildButteryTokens({
    debug: true,
    interactive: false,
    prompt: true,
    watch: true,
    isLocal: false,
  });
}
