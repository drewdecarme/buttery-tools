import { add } from "../src/cli-scripts/add";

/**
 * Runs the `add` cli script locally to test to
 * test out and validate the template is working
 */
add({ logLevel: "info", prompt: true, template: true });
