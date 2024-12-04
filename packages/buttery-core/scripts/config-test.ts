import { getButteryConfig } from "../src/config/index.js";

export async function test() {
  await getButteryConfig("commands", {
    defaults: {
      test: "hello",
    },
  });
}
test();
