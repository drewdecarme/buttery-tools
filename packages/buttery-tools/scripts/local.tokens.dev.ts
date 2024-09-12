import { buildButteryTokens } from "../.buttery/commands/tokens/tokens.buildButteryTokens";
import { LOG_TOKENS } from "../.buttery/commands/tokens/tokens.logger";

/**
 * A script to run a more specific build process for the tokens
 * to ensure that the tokens are created correctly for the apps
 * that can be launched using the CLI.
 *
 * For instance, the `buttery tokens` cli commands has a --interactive
 * option that launches an application that allows you to configure
 * the tokens in a live manner. The tokens needed for that are different
 * than the tokens that are need for the docs AND they need to go
 * in a different spot.
 *
 * The idea here is that we use the same build command with a "private"
 * or a non-publicly accessible CLI option called `isLocal` that will
 * run the same build but put the tokens in a different spot since
 * the CLI cannot have the tokens as a dependency.
 */
try {
  LOG_TOKENS.info("Developing tokens locally to the CLI.");
  await buildButteryTokens({
    prompt: false,
    debug: true,
    interactive: true,
    watch: true,
    isLocal: true
  });
} catch (error) {
  throw LOG_TOKENS.fatal(new Error(error as string));
}
