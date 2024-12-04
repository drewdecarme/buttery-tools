import type { Plugin } from "vite";

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
  [pageName: string]: string[];
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
  buildTarget: "cloudflare-pages" | "basic";
  /**
   * An optional key to further configure the routing
   * of your docs application.
   */
  routing?: {
    /**
     * Optionally add extra absolute paths to create pages with directories
     * that are outside the local .buttery/docs folder. This is helpful
     * when you have a mono-repo of multiple packages and want to co-locate
     * their docs in their package, but only want to publish one buttery-docs site.
     *
     * The directories that are defined here will create new pages entries.
     * - `routeName` is the name of the route that you wish to create. This will be the route that others will access this directory of docs at.
     * - `path` is the absolute path where the docs are. Most often, this is in another .buttery/docs folder but it can be elsewhere
     */
    pageDirectories?: { routeName: string; path: string }[];
  };
  /**
   * A key that allows you to configure how the navigation
   * will display as well as how it should be organized. Order is a
   * big part of semantic documentation and controlling the order
   * is important. Define the page
   * @example
   * ```ts
   * {
      docs: ["why-this"],
      "getting-started": [
        "introduction",
        "introduction.basic-components",
        "introduction.advanced-components",
        "quick-start-guide"
      ],
    }
   * ```
   */
  order?: ButteryConfigDocsOrder;
  header?: ButteryConfigDocsHeader;
  vitePlugins?: Plugin[];
};
