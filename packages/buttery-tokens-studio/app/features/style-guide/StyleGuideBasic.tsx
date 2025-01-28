import { css } from "@linaria/core";

import { StyleGuideBasicColor } from "./StyleGuideBasicColor";
import { StyleGuideBasicTypography } from "./StyleGuideBasicTypography";
import { StyleGuideBasicFont } from "./StyleGuideBasicFont";
import { StyleGuideBasicSpacing } from "./StyleGuideBasicSpacing";

const styles = css`
  background: white;
`;

const sections = [
  StyleGuideBasicColor,
  StyleGuideBasicFont,
  StyleGuideBasicTypography,
  StyleGuideBasicSpacing,
];

export function StyleGuideBasic() {
  return (
    <div className={styles}>
      {sections.map((Section, i) => {
        const marker = (i + 1).toString().padStart(2, "0");
        return <Section key={`section-${i}`} dxMarker={marker} />;
      })}
    </div>
  );
}
