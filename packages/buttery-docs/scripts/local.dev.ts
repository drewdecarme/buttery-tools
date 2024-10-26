import { dev } from "../src/cli-scripts/dev";

/**
 * Runs the `dev` cli script locally to test to
 * see if the dev scripts will work based upon
 * the resolved .buttery/config file
 */
dev({ logLevel: "info", prompt: true });
