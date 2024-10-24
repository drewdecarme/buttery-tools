import { buildIcons } from "../build-icons";
import { LOG } from "../utils";

export async function build() {
  LOG.info("Building icons...");
  await buildIcons();
  LOG.success("Done!");
}
