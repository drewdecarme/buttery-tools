import type { ButteryDocsGraph } from "../types";

export const graph: ButteryDocsGraph = {
  _index: {
    title: "_index",
    filepath:
      "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/_index.md",
    routeAbs: "/",
    routeRel: "/",
    pages: {},
  },
  introduction: {
    title: "Intro",
    filepath:
      "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/introduction.md",
    routeAbs: "/introduction",
    routeRel: "introduction",
    pages: {
      "why-this": {
        title: "Why This",
        filepath:
          "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/introduction.why-this.md",
        routeAbs: "/introduction/why-this",
        routeRel: "why-this",
        pages: {
          "because-so": {
            title: "Because So",
            filepath:
              "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/introduction.why-this.because-so.md",
            routeAbs: "/introduction/why-this/because-so",
            routeRel: "because-so",
            pages: {},
          },
        },
      },
    },
  },
  "getting-started": {
    title: "Getting Started",
    filepath:
      "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/getting-started.md",
    routeAbs: "/getting-started",
    routeRel: "getting-started",
    pages: {
      introduction: {
        title: "Introduction",
        filepath:
          "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/getting-started.introduction.md",
        routeAbs: "/getting-started/introduction",
        routeRel: "introduction",
        pages: {
          "basic-components": {
            title: "Basic Components",
            filepath:
              "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/getting-started.introduction.basic-components.md",
            routeAbs: "/getting-started/introduction/basic-components",
            routeRel: "basic-components",
            pages: {},
          },
          "advanced-components": {
            title: "Advanced Components",
            filepath:
              "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/getting-started.introduction.advanced-components.md",
            routeAbs: "/getting-started/introduction/advanced-components",
            routeRel: "advanced-components",
            pages: {},
          },
        },
      },
      "quick-start-guide": {
        title: "Quick Start Guide",
        filepath:
          "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/getting-started.quick-start-guide.md",
        routeAbs: "/getting-started/quick-start-guide",
        routeRel: "quick-start-guide",
        pages: {},
      },
    },
  },
  security: {
    title: "Securing your app",
    filepath:
      "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/security.md",
    routeAbs: "/security",
    routeRel: "security",
    pages: {
      "overview-of-security": {
        title: "Overview of Security",
        filepath:
          "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/security.overview-of-security.md",
        routeAbs: "/security/overview-of-security",
        routeRel: "overview-of-security",
        pages: {},
      },
      "prevention-of-attacks": {
        title: "Prevention of Attacks",
        filepath:
          "/Users/drewdecarme/git/personal/buttery-tools/packages/buttery-tokens/docs/security.prevention-of-attacks.md",
        routeAbs: "/security/prevention-of-attacks",
        routeRel: "prevention-of-attacks",
        pages: {},
      },
    },
  },
};
