import { z } from "zod";

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
export const CustomSchema = z
  .record(
    z.string(),
    z.union([
      z.number(),
      z.string(),
      z.object({
        value: z.number(),
        storeAsRem: z.boolean(),
      }),
    ])
  )
  .default({});
export type ButteryTokensConfigCustom = z.infer<typeof CustomSchema>;
