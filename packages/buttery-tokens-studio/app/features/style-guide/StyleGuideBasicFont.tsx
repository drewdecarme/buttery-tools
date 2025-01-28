import { css } from "@linaria/core";
import { match, P } from "ts-pattern";
import { makeColor, makeRem } from "@buttery/tokens/playground";

import { StyleGuidePage } from "./StyleGuidePage";
import { StyleGuidePageLeft } from "./StyleGuidePageLeft";
import { StyleGuidePageRight } from "./StyleGuidePageRight";
import type { StyleGuideSharedProps } from "./style-guide.utils";

import { useConfigurationContext } from "../Config.context";

const styles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;

  .family {
    padding: ${makeRem(32)};
    border: 1px solid ${makeColor("neutral-light", { opacity: 0.03 })};
    font-family: var(--family);
    background: var(--bg);

    .title {
      font-size: ${makeRem(48)};
      font-family: var(--family);
    }
    .alph {
      font-size: ${makeRem(18)};
      font-family: var(--family);
    }
    .a {
      font-size: ${makeRem(100)};
      font-family: var(--family);
    }
  }
`;

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function StyleGuideBasicFont(props: StyleGuideSharedProps) {
  const { font } = useConfigurationContext();
  return (
    <StyleGuidePage>
      <StyleGuidePageLeft dxMarker={props.dxMarker} dxTitle={props.dxTitle}>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam,
          sapiente eaque? Odio dolore rem id soluta quas quos blanditiis hic,
          ea, nam earum cum nulla laboriosam porro quo pariatur. Sapiente?
        </p>
      </StyleGuidePageLeft>
      <StyleGuidePageRight>
        <div className={styles}>
          {match(font)
            .with({ source: "manual" }, (state) =>
              Object.entries(state.families).map(([familyId, familyDef]) => (
                <div
                  key={familyId}
                  className="family"
                  style={{
                    // @ts-expect-error Custom properties are valid
                    "--family": familyDef.name,
                    "--bg": makeColor("neutral-light", {
                      opacity: getRandomNumber(0, 0.03),
                    }),
                  }}
                >
                  <div className="title">{familyDef.name}</div>
                  <div className="alph">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
                  <div className="alph">abcdefghijklmnopqrstuvwxyz</div>
                  <div className="alph">123456789!@#$%^&*()</div>
                  <div className="a">Aa</div>
                </div>
              ))
            )
            .with({ source: P.union("adobe", "google") }, () => {
              return <div>not implemented</div>;
            })
            .exhaustive()}
        </div>
      </StyleGuidePageRight>
    </StyleGuidePage>
  );
}
