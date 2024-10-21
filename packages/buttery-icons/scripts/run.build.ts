import { build as buildIcons } from "../src/icons.build";
import { LOG } from "../src/utils";

export async function build() {
  LOG.info("Building icons...");
  await buildIcons();
  LOG.success("Done!");
}
