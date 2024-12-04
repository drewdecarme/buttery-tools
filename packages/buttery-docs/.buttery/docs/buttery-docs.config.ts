import path from "node:path";
import { vitePluginButteryDocsInteractivePreview } from "../../dist/lib/plugin-interactive-preview";
import { defineButteryDocsConfig } from "../../src/lib";

export default defineButteryDocsConfig({
  buildTarget: "cloudflare-pages",
  header: {
    links: [
      [
        {
          type: "internal",
          text: "Docs",
          href: "/docs",
        },
      ],
      [
        {
          type: "internal",
          text: "Components",
          href: "/components",
        },
      ],
      [
        {
          type: "social",
          href: "https://github.com",
          label: "Github",
          provider: "github",
        },
      ],
    ],
  },
  order: {
    docs: [
      "introduction",
      "guides",
      "guides.deployment",
      "guides.mono-repo",
      "guides.naming-files",
      "guides.routing",
      "guides.seo",
      "guides.writing",
    ],
  },
  vitePlugins: () => [
    vitePluginButteryDocsInteractivePreview({
      componentRootDir: path.resolve(
        import.meta.dirname,
        "../../example-components"
      ),
    }),
  ],
});
