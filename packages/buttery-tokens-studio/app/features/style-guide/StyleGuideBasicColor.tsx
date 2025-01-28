import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { classes } from "@buttery/components";
import {
  ColorAccessibilityChecker,
  getAccessibleTextColor,
} from "@buttery/tokens-utils";

import { IconTick01 } from "~/icons/IconTick01";
import { IconCancel } from "~/icons/IconCancel";

import { StyleGuidePage } from "./StyleGuidePage";
import { StyleGuidePageRight } from "./StyleGuidePageRight";
import { StyleGuidePageLeft } from "./StyleGuidePageLeft";
import type { StyleGuideSharedProps } from "./style-guide.utils";
import { styleGuideTableStyles } from "./style-guide.utils";

import { useConfigurationContext } from "../Config.context";
import {
  convertBrandColorIntoVariants,
  convertNeutralColorIntoVariants,
} from "../config.utils.color";

const tableStyles = css`
  td:not(:first-child) {
    text-align: center;
    font-family: ${makeFontFamily("Consolas")};
    font-size: ${makeRem(14)} !important;
  }

  .wcag {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${makeRem(4)};
  }

  .compliance {
    border: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
    border-radius: ${makeRem(4)};
    padding: 0 ${makeRem(4)};
    height: ${makeRem(18)};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${makeRem(4)};
    font-weight: ${makeFontWeight("Mulish-medium")};

    span {
      font-size: ${makeRem(12)};
      font-family: ${makeFontFamily("Consolas")};
      line-height: 0.7;
      transform: translateY(1px);
    }
    &.pass {
      background-color: ${makeColor("success", { opacity: 0.2 })};
    }
    &.fail {
      background-color: ${makeColor("danger", { opacity: 0.2 })};
    }
  }
`;

const colorBlockStyles = css`
  font-size: ${makeRem(14)};
  font-family: ${makeFontFamily("Consolas")};

  &.base {
    height: ${makeRem(80)};
    margin-bottom: 8px;
    padding: ${makeRem(8)};
  }

  &.alt {
    height: ${makeRem(32)};
    padding: 0 ${makeRem(8)};
    display: flex;
    align-items: center;
  }
`;

const gapStyles = css`
  height: ${makeRem(44)};
`;

const checker = new ColorAccessibilityChecker();

function WCAGBadge(props: { pass: boolean; rating: "AA" | "AAA" }) {
  return (
    <div className={classes("compliance", props.pass ? "pass" : "fail")}>
      <span>{props.rating}</span>
      {props.pass ? <IconTick01 dxSize={10} /> : <IconCancel dxSize={10} />}
    </div>
  );
}

export function StyleGuideBasicColor({
  bgColor = "#FFFFFF",
  dxTitle,
  dxMarker,
}: {
  bgColor?: string;
} & StyleGuideSharedProps) {
  const { color } = useConfigurationContext();
  const bVariants = convertBrandColorIntoVariants(color);
  const nVariants = convertNeutralColorIntoVariants(color);
  const variants = Object.assign(bVariants, nVariants);

  return (
    <StyleGuidePage>
      <StyleGuidePageLeft dxMarker={dxMarker} dxTitle={dxTitle}>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam,
          sapiente eaque? Odio dolore rem id soluta quas quos blanditiis hic,
          ea, nam earum cum nulla laboriosam porro quo pariatur. Sapiente?
        </p>
        <p>
          *It&apos;s important to note that the accessibility ratings and
          contrast ratios you see are the output of the color against the
          current background. The metrics give you the information you need to
          use the those colors for font on the current background.
          <br />
          <br />
          It also assumes a standard font size of <strong>16px</strong>
        </p>
      </StyleGuidePageLeft>
      <StyleGuidePageRight>
        <table className={classes(styleGuideTableStyles, tableStyles)}>
          <thead>
            <tr>
              <th>Color</th>
              <th style={{ width: 100 }}>HEX</th>
              <th style={{ width: 100 }}>WCAG Rating</th>
              <th style={{ width: 100 }}>Contrast</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(variants).map(
              ([colorName, { base: baseHex, ...restVariants }], i) => {
                const baseWcag = checker.analyze(baseHex, bgColor, 16);
                return (
                  <>
                    <tr key={`${colorName}-${i}`}>
                      <td>
                        <div
                          className={classes(colorBlockStyles, "base")}
                          style={{
                            backgroundColor: baseHex,
                            color: getAccessibleTextColor(baseHex),
                          }}
                        >
                          {colorName}
                        </div>
                      </td>
                      <td>{baseHex}</td>
                      <td>
                        <div className="wcag">
                          <WCAGBadge
                            rating="AA"
                            pass={baseWcag.compliance.AA}
                          />
                          <WCAGBadge
                            rating="AAA"
                            pass={baseWcag.compliance.AAA}
                          />
                        </div>
                      </td>
                      <td>{baseWcag.compliance.contrast}</td>
                    </tr>
                    {Object.entries(restVariants)
                      .reverse()
                      .map(([variantName, variantHex], ii) => {
                        const variantWcag = checker.analyze(
                          variantHex,
                          bgColor,
                          16
                        );
                        return (
                          <tr key={`${colorName}-${variantName}-${ii}`}>
                            <td>
                              <div
                                className={classes(colorBlockStyles, "alt")}
                                style={{
                                  backgroundColor: variantHex,
                                  color: getAccessibleTextColor(variantHex),
                                }}
                              >
                                {variantName}
                              </div>
                            </td>
                            <td>{variantHex}</td>
                            <td>
                              <div className="wcag">
                                <WCAGBadge
                                  rating="AA"
                                  pass={variantWcag.compliance.AA}
                                />
                                <WCAGBadge
                                  rating="AAA"
                                  pass={variantWcag.compliance.AAA}
                                />
                              </div>
                            </td>
                            <td>{variantWcag.compliance.contrast}</td>
                          </tr>
                        );
                      })}
                    <tr className={gapStyles} />
                  </>
                );
              }
            )}
          </tbody>
        </table>
      </StyleGuidePageRight>
    </StyleGuidePage>
  );
}
