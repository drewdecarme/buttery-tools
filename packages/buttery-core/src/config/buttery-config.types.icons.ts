export type ButteryConfigIcons = {
  /**
   * The directory where the raw svgs are going to be stored. This is
   * also the directory where the IconComponent, it's generated types,
   * and the generated React files will live.
   *
   * A single directory keeps things simple and co-locates all of the
   * necessary files that need to be processed, generated, imported
   * and then used.
   *
   * @default ../icons
   */
  iconsDirectory?: string;
};
