import { css } from "@linaria/core";

import { StyleGuideBasicHome } from "./StyleGuideBasicHome";
import { styleGuideSections } from "./style-guide.utils";

const styles = css`
  background: white;
`;

export function StyleGuideBasic() {
  return (
    <div className={styles}>
      <StyleGuideBasicHome />
      {styleGuideSections.map(({ Component, ...restProps }, i) => {
        return <Component key={`section-${i}`} {...restProps} />;
      })}
    </div>
  );
}
