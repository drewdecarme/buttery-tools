export type ButteryConfigDocsHeaderLinkTypeSocial = {
  type: "social";
  provider: "github" | "discord";
  href: string;
  /**
   * Since these types of links only display icons, we need to ensure
   * that we provide a label that is accompanies the icon in order to ensure
   * that our links are 100% accessible.
   */
  label: string;
};
export type ButteryConfigDocsHeaderLinkTypeText = {
  type: "text";
  text: string;
  href: string;
};
export type ButteryConfigDocsHeaderLinkTypeInternal = {
  type: "internal";
  text: string;
  href: string;
};
export type ButteryConfigDocsHeaderLinkTypeDropdown = {
  type: "dropdown";
  text: string;
  items: (Omit<ButteryConfigDocsHeaderLinkTypeInternal, "type"> & {
    subText?: string;
    iconSrc: string;
    iconAlt: string;
  })[];
};
export type ButteryConfigDocsHeaderLink =
  | ButteryConfigDocsHeaderLinkTypeSocial
  | ButteryConfigDocsHeaderLinkTypeText
  | ButteryConfigDocsHeaderLinkTypeInternal
  | ButteryConfigDocsHeaderLinkTypeDropdown;

export type ButteryConfigDocsOrder = {
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
export type ButteryConfigDocsHeader = {
  /**
   * Adds a title in the upper left hand of the application
   */
  title?: string;
  /**
   * Adds a logo that is at a particular URL to be displayed in the top
   * left hand corner of the docs app
   */
  logo?: {
    src: string;
    alt: string;
  };
  /**
   * Links that will appear in order from left to right that link
   * out to different external pages or to places inside of the
   * documents app
   */
  links?: ButteryConfigDocsHeaderLink[][];
};

export type ButteryConfigDocs = {
  buildTarget: "cloudflare-pages";
  /**
   * Indicates the way that your .buttery/docs folder is organized.
   * @default 'section-folders'
   */
  routeStrategy?: "section-folders" | "flat";
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
  order?: ButteryConfigDocsOrder;
  header?: {
    /**
     * Adds a title in the upper left hand of the application
     */
    title?: string;
    /**
     * Adds a logo that is at a particular URL to be displayed in the top
     * left hand corner of the docs app
     */
    logo?: {
      src: string;
      alt: string;
    };
    /**
     * Links that will appear in order from left to right that link
     * out to different external pages or to places inside of the
     * documents app
     */
    links?: ButteryConfigDocsHeaderLink[][];
  };
};
