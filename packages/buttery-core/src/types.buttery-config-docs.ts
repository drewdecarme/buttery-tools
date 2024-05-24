export type ButteryConfigDocsRemix = {
  framework: "remix";
  /**
   * A prefix for which to look for in the `app/routes` directory.
   * This prefix will look for any files that begin with it or any
   * files that reside in a directory
   * @default "_docs"
   */
  docsPrefix?: string;
  /**
   * The ordering at which the documents should be displayed in the UI.
   * The string should be for the path of the route inside of the
   * routes directory
   * @example
   * [
   *   "_docs/getting-started.mdx",
   *   "_docs/getting-started.introduction.mdx",
   *   "_docs/getting-started.introduction.advanced.mdx"
   *   "_docs/security._index"
   * ]
   */
  ordering?: string[];
};
export type ButteryConfigDocsNextJs = { framework: "nextjs" };
export type ButteryConfigDocs =
  | ButteryConfigDocsRemix
  | ButteryConfigDocsNextJs;
