import { css } from "@linaria/core";

import { StyleGuidePage } from "./StyleGuidePage";
import { StyleGuidePageLeft } from "./StyleGuidePageLeft";
import { StyleGuideBasicColor } from "./StyleGuideBasicColor";
import { StyleGuidePageRight } from "./StyleGuidePageRight";

const styles = css`
  background: white;
`;

export function StyleGuideBasic() {
  return (
    <div className={styles}>
      <StyleGuideBasicColor />
      <StyleGuidePage>
        <StyleGuidePageLeft dxMarker="02" dxTitle="Size">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam,
            sapiente eaque? Odio dolore rem id soluta quas quos blanditiis hic,
            ea, nam earum cum nulla laboriosam porro quo pariatur. Sapiente?
          </p>
        </StyleGuidePageLeft>
        <StyleGuidePageRight>right</StyleGuidePageRight>
      </StyleGuidePage>
    </div>
  );
}
