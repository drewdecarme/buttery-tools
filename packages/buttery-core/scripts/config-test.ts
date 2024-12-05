import { getButteryConfig } from "../src/config/index.js";

export async function test() {
  try {
    const config = await getButteryConfig("commands", {
      prompt: true,
      defaults: {
        test: "hello",
      },
    });
    console.log(config);
  } catch (error) {
    console.error(error);
  }
}
test();
