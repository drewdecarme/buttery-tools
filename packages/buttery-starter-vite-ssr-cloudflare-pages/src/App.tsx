import { Route, Routes } from "react-router";

import About from "./pages/About";
import Home from "./pages/Home";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
);

export default App;
