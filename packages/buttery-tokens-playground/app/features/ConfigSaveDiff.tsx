import { css } from "@linaria/core";
import { DiffEditor } from "@monaco-editor/react";
import { useMemo } from "react";
import { makeColor, makeFontWeight, makeRem } from "@buttery/tokens/playground";

import { useConfigurationContext } from "./Config.context";

const styles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > div {
    margin-bottom: ${makeRem(16)};
  }

  .title {
    font-size: ${makeRem(16)};
    font-weight: ${makeFontWeight("semi-bold")};
    margin-bottom: ${makeRem(4)};
  }
  .help {
    font-size: ${makeRem(12)};
    color: ${makeColor("neutral-light", { opacity: 0.8 })};
  }
`;

const diffStyles = css`
  * {
    font-family: unset;
  }
`;

export function ConfigSaveDiff() {
  const { getConfig, originalConfig } = useConfigurationContext();

  const modifiedConfig = useMemo(() => getConfig(), [getConfig]);

  return (
    <>
      <div className={styles}>
        <div>
          <div className="title">Original</div>
          <div className="help">
            This is the original configuration before any edits were made
          </div>
        </div>
        <div>
          <div className="title">Modified</div>
          <div className="help">
            This configuration reflects the changes you have made in the GUI
          </div>
        </div>
      </div>
      <DiffEditor
        className={diffStyles}
        theme="vs-dark"
        height="500px"
        original={JSON.stringify(originalConfig.current, null, 2)}
        modified={JSON.stringify(modifiedConfig, null, 2)}
        language="json"
        options={{
          renderOverviewRuler: false,
        }}
      />
    </>
  );
}
