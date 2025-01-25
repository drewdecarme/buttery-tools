import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { ColorAccessibilityChecker } from "@buttery/tokens-utils";
import { classes } from "@buttery/components";

import { IconTick01 } from "~/icons/IconTick01";
import { IconCancel } from "~/icons/IconCancel";

import { useColorPreviewContext } from "./ColorPreview.context";

import { colorThemeMap } from "../config.utils.color";

const blockStyles = css`
  height: 100%;
  width: 100%;
  font-family: ${makeFontFamily("Consolas")};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .color {
    height: 100%;
    width: 100%;
    padding: ${makeRem(8)};
    font-family: ${makeFontFamily("Consolas")};
    height: ${makeRem(60)};
    background: var(--block-color);
  }

  .name {
    font-family: ${makeFontFamily("Consolas")};
    font-size: ${makeRem(12)};
  }

  .wcag {
    padding: ${makeRem(8)};
    font-size: ${makeRem(12)};
    border: 1px solid var(--block-color);
    border-top: 0;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    display: flex;
    flex-direction: column;
    gap: ${makeRem(8)};
    text-align: center;

    .ratio {
      text-decoration: underline;
      font-weight: ${makeFontWeight("Mulish-semiBold")};
    }

    .level {
      border: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
      border-radius: ${makeRem(8)};
      padding: ${makeRem(4)};
      height: ${makeRem(20)};
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${makeRem(4)};
      font-weight: ${makeFontWeight("Mulish-medium")};

      &.pass {
        background-color: ${makeColor("success", { opacity: 0.2 })};
      }
      &.fail {
        background-color: ${makeColor("danger", { opacity: 0.2 })};
      }
    }
  }

  &:not(:last-child) {
    .wcag {
      border-right: 0;
    }
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

const checker = new ColorAccessibilityChecker();

function ColorBlock({
  dxHex,
  dxName,
  showWCAG,
  bgHex,
  ...restProps
}: JSX.IntrinsicElements["div"] & {
  dxHex: string;
  dxName: string;
  showWCAG: boolean;
  bgHex: string;
}) {
  const colorWcag = checker.analyze(dxHex, bgHex, 18);
  console.log(colorWcag);

  return (
    <div
      {...restProps}
      className={blockStyles}
      style={{
        // @ts-expect-error custom properties are still appropriate
        "--block-color": dxHex,
      }}
    >
      <div className="color">
        <div style={{ color: getTextColor(dxHex) }} className="name">
          {dxName}
        </div>
      </div>
      {showWCAG && (
        <div className="wcag">
          <div className="ratio">{colorWcag.compliance.contrast}</div>
          <div
            className={classes(
              "level",
              colorWcag.compliance.AA ? "pass" : "fail"
            )}
          >
            AA:{" "}
            {colorWcag.compliance.AA ? (
              <IconTick01 dxSize={10} />
            ) : (
              <IconCancel dxSize={10} />
            )}
          </div>
          <div
            className={classes(
              "level",
              colorWcag.compliance.AAA ? "pass" : "fail"
            )}
          >
            AAA:{" "}
            {colorWcag.compliance.AAA ? (
              <IconTick01 dxSize={10} />
            ) : (
              <IconCancel dxSize={10} />
            )}
          </div>
        </div>
      )}
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
    width: auto;
    overflow: hidden;

    &:first-child {
      border-radius: ${makeRem(12)};
    }

    &:last-child {
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      & > div:first-child {
        border-top-left-radius: ${makeRem(12)};
        border-bottom-left-radius: ${makeRem(12)};
      }

      & > div:last-child {
        border-top-right-radius: ${makeRem(12)};
        border-bottom-right-radius: ${makeRem(12)};
      }
    }
  }
`;

export function ColorPreviewBlocks(props: {
  colorName: string;
  baseVariantHex: string;
  variants: Record<string, string>;
}) {
  const { showWCAG, themeMode } = useColorPreviewContext();
  return (
    <div className={styles}>
      <ColorBlock
        style={{ backgroundColor: props.baseVariantHex }}
        dxName={props.colorName}
        dxHex={props.baseVariantHex}
        showWCAG={showWCAG}
        bgHex={colorThemeMap[themeMode]}
      />
      <div>
        {Object.entries(props.variants).map(([variantName, variantHex]) => (
          <ColorBlock
            key={variantName}
            dxName={variantName}
            dxHex={variantHex}
            showWCAG={showWCAG}
            bgHex={colorThemeMap[themeMode]}
          />
        ))}
      </div>
    </div>
  );
}
