export type ButteryConfigDocs = {
  /**
   * A key that allows you to configure how the navigation
   * will display as well as how it should be organized. Order is a
   * big part of semantic documentation and controlling the order
   * outside of the remix splat conventions is important. This key
   * gives you some decent control over how sections will display
   * as well as in what order their pages display
   * @example
   * ```ts
   * {
      introduction: {
        display: "Intro",
        routeOrder: ["_index", "why-this"]
      },
      "getting-started": {
        display: "Getting Started",
        routeOrder: [
          "getting-started.introduction",
          "getting-started.introduction.basic-components",
          "getting-started.introduction.advanced-components",
          "getting-started.quick-start-guide"
        ]
      },
      security: {
        display: "Securing your app",
        routeOrder: [
          "security.overview-of-security",
          "security.prevention-of-attacks"
        ]
      }
    }
   * ```
   */
  order?: {
    [section: string]: {
      /**
       * The string that will be displayed as the header
       */
      display: string;
      /**
       * The order of the routes. These are the file names
       * sans the docsPrefix and the section name
       * @example
       * if the file name = `_docs.getting-started.introduction.advanced`
       * the string in the route order will be `introduction.advanced`
       *
       */
      routeOrder: string[];
    };
  };
};
