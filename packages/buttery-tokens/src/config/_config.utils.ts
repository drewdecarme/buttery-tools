import { z } from "zod";

import { butteryTokensConfigRuntimeSchema } from "./schema.runtime";
import { butteryTokensConfigFontSchema } from "./schema.font";

export const butteryTokensConfigSchema = z.object({
  runtime: butteryTokensConfigRuntimeSchema,
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
   */
  gridSystem: z.preprocess(
    (value) => (typeof value === "undefined" ? 4 : value),
    z.number().optional()
  ),
  /**
   * The font definitions and configurations for your design tokens
   */
  font: butteryTokensConfigFontSchema,
  /**
   * Define the breakpoints that will govern how the application responds to the viewport size.
   * @default {
      "phone-sm": 320,
      phone: 375,
      "phone-lg": 414,
      "tablet-sm": 480, 
      tablet: 768,       
      "tablet-lg": 1024,  
      "desktop-sm": 1200, 
      desktop: 1280,     
      "desktop-lg": 1400
    }
   */
  breakpoints: z.preprocess(
    (value) =>
      typeof value === "undefined"
        ? {
            "phone-sm": 320, // This breakpoint targets small mobile devices, including older smartphones like the iPhone 5 and SE. It's crucial to ensure basic functionality and readability on these smaller screens.,
            phone: 375, // Common for newer smartphones, including devices like the iPhone 6, 7, 8, and X series. Many Android phones also fall into this range.,
            "phone-lg": 414, // This size includes larger smartphones like the iPhone Plus series (6, 7, 8 Plus) and many of the larger Android phones,
            "tablet-sm": 480, // Often used for small tablets and large smartphones in landscape mode.
            tablet: 768, // Targets smaller tablets, such as the iPad Mini, and larger smartphones in landscape mode. This is a key breakpoint for transitioning from a mobile-friendly layout to a more tablet-optimized design.
            "tablet-lg": 1024, // This size is common for standard tablets like the iPad. It’s a significant breakpoint where layouts often shift to accommodate a more desktop-like experience.
            "desktop-sm": 1200, // A common breakpoint for smaller desktop monitors and larger tablets in landscape mode. It marks the transition to more complex and spacious layouts.
            desktop: 1280, // Often used for larger desktop and laptop screens. This breakpoint helps in enhancing the layout for high-resolution monitors, providing more space for content and navigation elements.
            "desktop-lg": 1400, // Targets full HD monitors, commonly used in desktop displays. Ensures that content utilizes the available screen real estate efficiently.
          }
        : value,
    z.record(z.string(), z.number()).optional()
  ),
  /**
   * ## Description
   * Add custom defined key value pairs of tokens that fall outside
   * of the the parameters of the required token configurations. You can also
   * transform the property at build time to transform the value of the token
   * that is stored in the :root
   *
   * ## Uses Cases
   * Let's say that you have a header and a few other components that are deeply nested in your layout
   * and that you want to make sure that those separate components are sticky relative to the top of the
   * header. If you're using react, you would traditionally pass a ref around or use the DOM document
   * API to get the header height after it renders. This however enables you to easily use
   * the `makeCustom` token to reference that height regardless of where you are in your code.
   *
   * Think of this as a global reference that you can use a pure function to easily interface
   * that variable.
   *
   * @default undefined
   * @example
   * ```json
   * { "layout-header-height": 48 };
   * ```
   */
  custom: z
    .record(
      z.string(),
      z.union([
        z.number(),
        z.string(),
        z.object({
          value: z.number(),
          storeAsRem: z.preprocess(
            (value) => (typeof value === "undefined" ? false : value),
            z.boolean().optional()
          ),
        }),
      ])
    )
    .optional(),
});
export type ButteryTokensConfig = z.infer<typeof butteryTokensConfigSchema>;
