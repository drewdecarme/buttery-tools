import "@buttery/tokens/css";
import "@buttery/tokens/generated/css";
import "./root.css";

import { ConfigColor } from "./ConfigColor";
import { Layout } from "./Layout";

function App() {
  return (
    <Layout>
      <ConfigColor />
    </Layout>
  );
}

export default App;
