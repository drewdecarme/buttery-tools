import type { ButteryTokensColor } from "@buttery/tokens-utils/schemas";
import {
  createBrandVariants,
  createNeutralVariants,
  hexToHsl,
  hexToRgb,
} from "@buttery/tokens-utils";

import { type CompileFunction, MakeTemplate } from "./MakeTemplate.js";

import { LOG } from "../../utils/util.logger.js";

function createColorManifest(colorConfig: ButteryTokensColor | undefined) {
  const colorVariantsBrand = createBrandVariants(colorConfig?.brand);
  const colorVariantsNeutral = createNeutralVariants(colorConfig?.neutral);

  const variantManifest = { ...colorVariantsBrand, ...colorVariantsNeutral };

  const flatManifest: Record<string, string> = {};

  for (const color in variantManifest) {
    const variants = variantManifest[color];
    if (typeof variants !== "object") {
      flatManifest[color] = variants;
      continue;
    }

    for (const variant in variants) {
      if (variant === "base") {
        flatManifest[color] = variants[variant];
        continue;
      }
      flatManifest[`${color}-${variant}`] = variants[variant];
    }
  }

  return flatManifest;
}

const template: CompileFunction = ({
  config,
  docs,
  functionName,
  cssVarPrefix,
}) => {
  const manifest = createColorManifest(config.color);
  const colorNames = Object.keys(manifest);

  return `export const colorAndVariants = ${JSON.stringify(manifest, null, 2)};
export type ColorAndVariants = keyof typeof colorAndVariants;
export type MakeColorOptions = { opacity?: number };

/**
 * ## Description
 * ${docs.description}
 *
 * ## Usage
 * ### css-in-ts
 * \`\`\`ts
 * import { css } from "@linaria/core";
 * ${docs.importClause}
 * 
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ color: ${functionName}("${colorNames[0]}") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * 
 * \`
 * \`\`\`
 */
export function ${functionName}<T extends ColorAndVariants>(tokenName: T, options?: MakeColorOptions): string {
  const opacity = options?.opacity ?? 1;
  return \`rgba(var(${cssVarPrefix}-\${tokenName}-rgb), \${opacity})\`;
}
`;
};

const css: CompileFunction = ({ config, cssVarPrefix }) => {
  const manifest = createColorManifest(config.color);

  const variants = Object.entries(manifest).reduce<string[]>(
    (accum, [variantId, variantHexValue]) => {
      // construct the variant variables
      const variantPrefix = `${cssVarPrefix}-${variantId}`;
      const hex = variantHexValue;
      const { h, s, l } = hexToHsl(hex);
      const { r, g, b } = hexToRgb(hex);
      const variant = `${variantPrefix}: ${hex}`;
      const variantHex = `${variantPrefix}-hex: ${hex}`;
      const variantHsl = `${variantPrefix}-hsl: ${h}, ${s}, ${l}`;
      const variantRgb = `${variantPrefix}-rgb: ${r}, ${g}, ${b}`;

      return [...accum, variant, variantHex, variantHsl, variantRgb];
    },
    []
  );

  const variantString = variants.join(`;\n`).concat(";\n");
  LOG.debug("Variants:");
  LOG.debug(variantString);

  return variantString;
};

export const MakeTemplateColor = new MakeTemplate({
  functionName: "makeColor",
  functionDescription:
    "A utility that allows you to safely incorporate brand color into your apps by easily adding the design token along with optional adjustments & variants.",
  variableBody: "color",
  template,
  css,
});
