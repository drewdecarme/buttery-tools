import { getButteryConfig } from "../src/config";

export async function test() {
  await getButteryConfig("commands");
}
test();
