import { css } from "@linaria/core";

import { StyleGuidePage } from "./StyleGuidePage";
import { StyleGuidePageLeft } from "./StyleGuidePageLeft";
import { StyleGuidePageRight } from "./StyleGuidePageRight";

import { useConfigurationContext } from "../Config.context";

const styles = css``;

export function StyleGuideBasicSize(props: { dxMarker: string }) {
  const {
    sizing: { size },
  } = useConfigurationContext();
  console.log(size);
  return (
    <StyleGuidePage>
      <StyleGuidePageLeft dxMarker={props.dxMarker} dxTitle="Size">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam,
          sapiente eaque? Odio dolore rem id soluta quas quos blanditiis hic,
          ea, nam earum cum nulla laboriosam porro quo pariatur. Sapiente?
        </p>
      </StyleGuidePageLeft>
      <StyleGuidePageRight>
        <div className={styles}></div>
      </StyleGuidePageRight>
    </StyleGuidePage>
  );
}
