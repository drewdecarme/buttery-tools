import { buildButteryTokens } from "../buildButteryTokens";

// TODO: Add some public options
export async function build() {
  buildButteryTokens({
    debug: false,
    interactive: false,
    watch: false,
    prompt: false,
    isLocal: false,
  });
}
