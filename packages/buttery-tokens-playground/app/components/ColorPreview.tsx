import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";

const blockStyles = css`
  height: 100%;
  width: 100%;
`;

function ColorBlock(props: JSX.IntrinsicElements["div"]) {
  return <div {...props} className={blockStyles} />;
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
    border-radius: ${makeRem(16)};
    height: ${makeRem(80)};
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
        <ColorBlock style={{ backgroundColor: props.baseVariantHex }} />
      </div>
      <div>
        {Object.entries(props.variants).map(([variantName, variantHex]) => (
          <ColorBlock
            key={variantName}
            style={{ backgroundColor: variantHex }}
          />
        ))}
      </div>
    </div>
  );
}
