import type {
  ButteryDocsGraph,
  ButteryDocsGraphValue,
} from "../../../../.buttery/commands/docs/docs.types";

export const graph: ButteryDocsGraph = {
  _index: {
    routeTitle: "_index",
    routeMeta: [{ title: "Home" }],
    filepath: "/some-absolute-path/_index.md",
    filename: "_index",
    fileExtension: "md",
    routeAbs: "/",
    routeRel: "/",
    toc: [],
    pages: {},
  },
  introduction: {
    routeTitle: "introduction",
    routeMeta: [{ title: "Introduction" }],
    filepath: "/some-absolute-path/introduction.md",
    filename: "introduction",
    fileExtension: "md",
    routeAbs: "/introduction",
    routeRel: "introduction",
    toc: [],
    pages: {
      architecture: {
        routeTitle: "Architecture",
        routeMeta: [{ title: "Architecture" }],
        filepath: "/some-absolute-path/introduction.architecture.md",
        filename: "introduction.architecture",
        fileExtension: "md",
        routeAbs: "/introduction/architecture",
        routeRel: "architecture",
        toc: [
          {
            level: 2,
            title: "Overview",
            link: "#overview",
            children: [],
          },
          {
            level: 2,
            title: "Key Decisions",
            link: "#key-decisions",
            children: [],
          },
        ],
        pages: {},
      },
    },
  },
  reference: {
    routeTitle: "reference",
    routeMeta: [{ title: "Reference" }],
    filepath: "/some-absolute-path/reference.md",
    fileExtension: "md",
    filename: "reference",
    routeAbs: "/reference",
    routeRel: "reference",
    toc: [],
    pages: {
      cli: {
        routeTitle: "CLI Reference",
        filepath: "/some-absolute-path/reference.cli.md",
        routeMeta: [{ title: "CLI Reference" }],
        filename: "reference.cli",
        routeAbs: "/reference/cli",
        fileExtension: "md",
        routeRel: "cli",
        toc: [
          {
            level: 2,
            title: "commands",
            link: "#commands",
            children: [
              {
                level: 3,
                title: "commands.build",
                link: "#commandsbuild",
                children: [],
              },
              {
                level: 3,
                title: "commands.create-command (WIP)",
                link: "#commandscreate-command-wip",
                children: [],
              },
              {
                level: 3,
                title: "commands.dev",
                link: "#commandsdev",
                children: [],
              },
              {
                level: 3,
                title: "commands.init (WIP)",
                link: "#commandsinit-wip",
                children: [],
              },
            ],
          },
          {
            level: 2,
            title: "docs",
            link: "#docs",
            children: [
              {
                level: 3,
                title: "buttery docs dev (WIP)",
                link: "#buttery-docs-dev-wip",
                children: [],
              },
              {
                level: 3,
                title: "buttery docs build (WIP)",
                link: "#buttery-docs-build-wip",
                children: [],
              },
              {
                level: 3,
                title: "buttery docs format (WIP)",
                link: "#buttery-docs-format-wip",
                children: [],
              },
              {
                level: 3,
                title: "buttery docs init (WIP)",
                link: "#buttery-docs-init-wip",
                children: [],
              },
              {
                level: 3,
                title: "buttery docs lint (WIP)",
                link: "#buttery-docs-lint-wip",
                children: [],
              },
            ],
          },
          {
            level: 2,
            title: "tokens",
            link: "#tokens",
            children: [
              {
                level: 3,
                title: "tokens.dev (WIP)",
                link: "#tokensdev-wip",
                children: [],
              },
              {
                level: 3,
                title: "tokens.build (WIP)",
                link: "#tokensbuild-wip",
                children: [],
              },
            ],
          },
          {
            level: 2,
            title: "help",
            link: "#help",
            children: [],
          },
        ],
        pages: {},
      },
    },
  },
};

export const toc: ButteryDocsGraphValue["toc"] = [
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
];
