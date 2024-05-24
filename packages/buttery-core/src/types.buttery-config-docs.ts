export type ButteryConfigDocsRemix = {
  framework: "remix";
  /**
   * A prefix for which to look for in the `app/routes` directory.
   * This prefix will look for any files that begin with it or any
   * files that reside in a directory
   */
  docsPrefix: string;
};
export type ButteryConfigDocsNextJs = { framework: "nextjs" };
export type ButteryConfigDocs = {
  /**
   * The directory of the documents folder relative to the
   * `config.root` that contains all of the markdown files
   *
   * NOTE: This directory is read and then parsed by the CLI
   * to create a representation of the routes. A graph is created
   * and then stored server side so the app can
   * take full advantage of caching and SEO
   * @default "./app/routes/_docs"
   * @deprecated
   */
  docsDirectory: string;
} & (ButteryConfigDocsRemix | ButteryConfigDocsNextJs);
