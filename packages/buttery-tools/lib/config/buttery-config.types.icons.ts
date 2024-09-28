export type ButteryConfigIcons = {
  /**
   * An optional namespace where the generated icons
   * are stored. This is helpful when dealing with monorepos
   * and you have multiple icon sets that need to be generated
   * and then subsequently imported differently.
   * @default undefined
   * @example `base`
   * ```tsx
   * import { IconComponent } from "@buttery/icons/base"
   * ```
   */
  namespace?: string;
  /**
   * The directory where the raw SVGs are stored.
   * @default `.buttery/icons`
   */
  svgDir?: string;
  /**
   * The directory where the React components are stored. By default
   * this directory won't be checked in since these are generated files
   * however, if you feel that these generated files need to be checked in
   * then you can adjust where the outDir is to a place in your repo
   * that can be staged by git
   * @default `node_modules/@buttery/icons`
   */
  outDir?: string;
};
