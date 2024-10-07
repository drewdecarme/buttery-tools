import { buildButteryTokens } from "../utils/tokens.buildButteryTokens";

export async function build() {
  buildButteryTokens({
    debug: false,
    interactive: false,
    watch: false,
    prompt: false,
    isLocal: false,
  });
}
