export type TokensConfig = {
  /**
   * ## Description
   * The integer that will regulate the visual harmony of the application by enforcing strict spacing requirements
   *
   * ## Overview
   * The point grid system is a framework that helps you place and arrange elements in your design with precision.
   * The general premise is that whenever you create space between elements, it should be divisible by four (4, 8, 12, 16, etc.).
   *
   * One of the most noticeable advantages of the 4-point grid system is that it acts as compass to enhance visual hierarchy and organization within your design.
   * Following the 4-point grid creates a sense of order and structure. Elements don't just sit on the canvas — they align
   * with purpose and intent by following the grid lines with precision.
   *
   * This draws the user's attention to pivotal points and accentuates the key components for a clean and well-orchestrated visual flow.
   * The result? Designs that not only look appealing but also feel intuitive and fluid to navigate.
   *
   * Setting this value really depends upon the purpose of your application. As a general rule of thumb
   * if you're creating a marketing website, then an `8pt` system might be the way to go since white space,
   * negative space, etc.. is important to make your content easily consumable. If you're building something like
   * Figma, Webflow, a Bloomberg Terminal or any other screen intensive tool, you might want a `4pt` grid system to compress space and manage
   * it a little more granularly.
   *
   * ## Learn More
   * - [Why Webflow uses a 4pt grid system](https://webflow.com/blog/why-were-using-a-4-point-grid-in-webflow)
   * - [The grid point system overview](https://www.thedesignership.com/blog/the-ultimate-spacing-guide-for-ui-designers)
   *
   * @default 4
   *
   */
  gridSystem: 4 | 8 | 12;
  /**
   * ## Description
   * A string that will prefix all of the CSS Variables that are used.
   *
   * ## Overview
   * This value is important in order to avoid `:root` level conflicts in your application's CSS.
   * Essentially this value namespaces your tokens so they don't conflict with any others.
   *
   * ## Examples
   * Let's take a very simple example `--navbar-height`. This seems like a pretty specific variable
   * however if there are 3rd party libraries that are also included, there could be another CSS Variable
   * or in this case, token, that would conflict with this. In order to ensure that all of the tokens are reconciled
   * properly through this packages utilities, we set a `prefix` to namespace our tokens to avoid those property clashes.
   *
   * @example
   * `--navbar-height` becomes `--${prefix}-navbar-height`
   */
  prefix: string;
  /**
   * ## Description
   * Enforces all constraints in the utilities.
   * - `true` - throws if the constrains of a utility are violated at runtime
   * - `false` - prints a warning if the constrains of a utility are violated at runtime
   *
   * ## Uses Cases
   * Depending upon your use case, this can be flipped. If you're in a distributed / global team that needs more control
   * (i.e. bumpers on your proverbial bolling alley lanes) you should most likely set this to true. This will evaluate at
   * build time and prevent you from releasing any interface without first satisfying the requirements.
   *
   * If you're on a smaller / more agile team, this can be set to false to increase the speed at which you develop, however
   * it will print warnings at develop / build time to ensure that you know you're doing things against the constraints of
   * tool.
   *
   * @default false
   */
  strict: boolean;
  /**
   * Stops the warnings from being printed to the console when `strict: false`. This should be used SPARINGLY
   */
  suppressStrictWarnings: boolean;
  font: {
    family: { [key in string]: string };
    weight: { [key in string]: number };
    typography: {
      [key in string]: {
        fontFamily: string;
        fontSize: number;
        lineHeight: number;
      };
    };
  };
};
