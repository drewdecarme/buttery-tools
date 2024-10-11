import type { ButteryConfig } from "@buttery/tools";

const config: ButteryConfig = {
  docs: {
    buildTarget: "basic",
    header: {
      title: "Playground",
      links: [[{ type: "internal", href: "/test", text: "Test" }]],
    },
  },
};
export default config;
