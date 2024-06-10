import type { ButteryDocsGraph } from "../../commands/_utils/types";

export const graph: ButteryDocsGraph = {
  _index: {
    title: "_index",
    filepath: "_index.md",
    routeAbs: "/",
    routeRel: "/",
    toc: [],
    pages: {},
  },
  introduction: {
    title: "Intro",
    filepath: "introduction.md",
    routeAbs: "/introduction",
    routeRel: "introduction",
    toc: [],
    pages: {
      "why-this": {
        title: "Why This",
        filepath: "introduction.why-this.md",
        routeAbs: "/introduction/why-this",
        routeRel: "why-this",
        toc: [
          {
            level: 1,
            title: "Why This?",
            link: "#why-this",
            children: [],
          },
        ],
        pages: {
          "because-so": {
            title: "Because So",
            filepath: "introduction.why-this.because-so.md",
            routeAbs: "/introduction/why-this/because-so",
            routeRel: "because-so",
            toc: [
              {
                level: 1,
                title: "Because So?",
                link: "#because-so",
                children: [],
              },
            ],
            pages: {},
          },
        },
      },
    },
  },
  "getting-started": {
    title: "Getting Started",
    filepath: "getting-started.md",
    routeAbs: "/getting-started",
    routeRel: "getting-started",
    toc: [],
    pages: {
      introduction: {
        title: "Introduction",
        filepath: "getting-started.introduction.md",
        routeAbs: "/getting-started/introduction",
        routeRel: "introduction",
        toc: [
          {
            level: 1,
            title: "Introduction",
            link: "#introduction",
            children: [],
          },
        ],
        pages: {
          "basic-components": {
            title: "Basic Components",
            filepath: "getting-started.introduction.basic-components.md",
            routeAbs: "/getting-started/introduction/basic-components",
            routeRel: "basic-components",
            toc: [
              {
                level: 1,
                title: "Basic Components",
                link: "#basic-components",
                children: [],
              },
            ],
            pages: {},
          },
          "advanced-components": {
            title: "Advanced Components",
            filepath: "getting-started.introduction.advanced-components.md",
            routeAbs: "/getting-started/introduction/advanced-components",
            routeRel: "advanced-components",
            toc: [
              {
                level: 1,
                title: "Advanced Components",
                link: "#advanced-components",
                children: [
                  {
                    level: 2,
                    title: "Overview",
                    link: "#overview",
                    children: [],
                  },
                  {
                    level: 2,
                    title: "Explanation",
                    link: "#explanation",
                    children: [
                      {
                        level: 3,
                        title: "Technical Requirements",
                        link: "#technical-requirements",
                        children: [],
                      },
                    ],
                  },
                  {
                    level: 2,
                    title: "Testing",
                    link: "#testing",
                    children: [
                      {
                        level: 3,
                        title: "Testing with vitest",
                        link: "#testing-with-vitest",
                        children: [],
                      },
                      {
                        level: 3,
                        title: "Testing with jest",
                        link: "#testing-with-jest",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
            pages: {},
          },
        },
      },
      "quick-start-guide": {
        title: "Quick Start Guide",
        filepath: "getting-started.quick-start-guide.md",
        routeAbs: "/getting-started/quick-start-guide",
        routeRel: "quick-start-guide",
        toc: [
          {
            level: 1,
            title: "Quick Start Guide",
            link: "#quick-start-guide",
            children: [],
          },
        ],
        pages: {},
      },
    },
  },
  security: {
    title: "Securing your app",
    filepath: "security.md",
    routeAbs: "/security",
    routeRel: "security",
    toc: [],
    pages: {
      "overview-of-security": {
        title: "Overview of Security",
        filepath: "security.overview-of-security.md",
        routeAbs: "/security/overview-of-security",
        routeRel: "overview-of-security",
        toc: [],
        pages: {},
      },
      "prevention-of-attacks": {
        title: "Prevention of Attacks",
        filepath: "security.prevention-of-attacks.md",
        routeAbs: "/security/prevention-of-attacks",
        routeRel: "prevention-of-attacks",
        toc: [],
        pages: {},
      },
    },
  },
};
