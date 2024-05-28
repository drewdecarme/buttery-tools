import "@buttery/tokens/css";
import "@buttery/tokens/generated/css";

import { generatedTokens } from "./tokens-generated";
import { localTokens } from "./tokens-local";

function App() {
  return (
    <div
      style={{
        fontWeight: generatedTokens.makeFontWeight("bold")
      }}
    >
      <h1
        style={{
          fontWeight: localTokens.makeFontWeight("light")
        }}
      >
        Vite + React
      </h1>
      n
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> ad save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
