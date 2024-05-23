import type { ButteryDocsGraph } from "../types";

export const graph: ButteryDocsGraph = {
  "getting-started": {
    title: "getting started",
    content: "",
    pages: {
      introduction: {
        title: "Introduction",
        content: "\n# Introduction\n",
        pages: {
          "advanced-components": {
            title: "Advanced Components",
            content: "\n# Advanced Components\n",
            pages: {}
          },
          "basic-components": {
            title: "Basic Components",
            content: "\n# Basic Components\n",
            pages: {}
          }
        }
      },
      "quick-start-guide": {
        title: "Quick Start Guide",
        content: "\n# Quick Start Guide\n",
        pages: {}
      }
    }
  },
  security: {
    title: "security",
    content: "",
    pages: {
      "overview-of-security": {
        title: "Overview of Security",
        content: "",
        pages: {}
      },
      "prevention-of-attacks": {
        title: "Prevention of attacks",
        content: "",
        pages: {
          details: {
            title: "Detail 1",
            content: "",
            pages: {
              "nested-details": {
                title: "Nested Details 1",
                content: "",
                pages: {}
              }
            }
          }
        }
      }
    }
  },
  index: {
    title: "index",
    content: "# Welcome\n",
    pages: {}
  }
};
