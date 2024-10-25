import { buildButteryTokens } from "../buildButteryTokens";

// TODO: Add some public options
export function build() {
  buildButteryTokens({
    debug: false,
    interactive: false,
    watch: false,
    prompt: false,
    isLocal: false,
  });
}
