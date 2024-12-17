import { makeFontFamily, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";

const blockStyles = css`
  height: 100%;
  width: 100%;
  padding: ${makeRem(8)};
  font-family: ${makeFontFamily("code")};

  .name {
    font-family: ${makeFontFamily("code")};
    font-size: ${makeRem(10)};
  }
`;

function getTextColor(hex: string): "white" | "black" {
  // Ensure the hex color is in the correct format
  const cleanHex = hex.replace("#", "");
  if (![3, 6].includes(cleanHex.length)) {
    throw new Error("Invalid hex color format");
  }

  // Expand shorthand hex format (e.g., "abc" -> "aabbcc")
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanHex;

  // Extract RGB values
  const r = parseInt(fullHex.slice(0, 2), 16) / 255;
  const g = parseInt(fullHex.slice(2, 4), 16) / 255;
  const b = parseInt(fullHex.slice(4, 6), 16) / 255;

  // Convert RGB to relative luminance
  const luminance = (value: number) =>
    value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

  const relativeLuminance =
    0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);

  // Return black or white based on luminance
  return relativeLuminance > 0.5 ? "black" : "white";
}

function ColorBlock({
  dxHex,
  dxName,
  ...restProps
}: JSX.IntrinsicElements["div"] & { dxHex: string; dxName: string }) {
  return (
    <div
      {...restProps}
      className={blockStyles}
      style={{
        background: dxHex,
      }}
    >
      <div style={{ color: getTextColor(dxHex) }} className="name">
        {dxName}
      </div>
    </div>
  );
}

const styles = css`
  width: 100%;
  display: grid;
  grid-template-columns: ${makeRem(100)} 1fr;
  gap: ${makeRem(16)};

  & + & {
    margin-top: ${makeRem(16)};
  }

  & > div {
    border-radius: ${makeRem(12)};
    height: ${makeRem(60)};
    width: auto;
    overflow: hidden;

    &:last-child {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }
`;

export function ColorPreview(props: {
  colorName: string;
  baseVariantHex: string;
  variants: Record<string, string>;
}) {
  return (
    <div className={styles}>
      <div>
        <ColorBlock
          style={{ backgroundColor: props.baseVariantHex }}
          dxName={props.colorName}
          dxHex={props.baseVariantHex}
        />
      </div>
      <div>
        {Object.entries(props.variants).map(([variantName, variantHex]) => (
          <ColorBlock
            key={variantName}
            dxName={variantName}
            dxHex={variantHex}
          />
        ))}
      </div>
    </div>
  );
}
