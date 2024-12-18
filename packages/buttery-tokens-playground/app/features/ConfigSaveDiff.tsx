import { css } from "@linaria/core";
import { DiffEditor } from "@monaco-editor/react";

const styles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export function ConfigSaveDiff() {
  return (
    <>
      <div className={styles}>
        <div>current</div>
        <div>new</div>
      </div>
      <DiffEditor
        theme="vs-dark"
        height="500px"
        original={JSON.stringify({ name: "John", age: 30 }, null, 2)}
        modified={JSON.stringify({ name: "Jane", age: 31 }, null, 2)}
        language="typescript"
        options={{
          renderOverviewRuler: false,
        }}
      />
    </>
  );
}
