import { z } from "zod";

export const butteryIconsConfigSchema = z.object({
  /**
   * The directory where the raw svgs are going to be stored. This is
   * also the directory where the IconComponent, it's generated types,
   * and the generated React files will live.
   *
   * A single directory keeps things simple and co-locates all of the
   * necessary files that need to be processed, generated, imported
   * and then used.
   *
   * @default <root>/.buttery/icons/svg
   */
  svgDir: z.preprocess(
    (value) => value || "./.buttery/icons/svg",
    z.string().optional()
  ),
  /**
   * The destination directory that all of the transformed icons will be
   * generated and the icon component housed. A relative path at the same level
   * as the .buttery directory
   * @default <root>/icons
   */
  outDir: z.preprocess((value) => value || "./icons", z.string().optional()),
});

export type ButteryIconsConfig = z.infer<typeof butteryIconsConfigSchema>;
