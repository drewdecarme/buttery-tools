import type { ButteryDocsRoute } from "@buttery/tools/docs";
import { dataHeader, indexRoute } from "__ROUTE_MANIFEST__";
import { Suspense, lazy } from "react";
import { Outlet, Route, type RouteObject, Routes } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import "@buttery/tools/docs/css";
import { Layout } from "./components/Layout";

// function createRoute(route: ButteryDocsRoute): RouteObject {
//   const Component = lazy(() => import(/* @vite-ignore */ route.fsPath));

//   return {
//     path: route.routePath,
//     element: (
//       <Suspense fallback={<div>Loading...</div>}>
//         <Component />
//       </Suspense>
//     ),
//   };
// }

// const indexRouteObject = createRoute(indexRoute);

const App = () => (
  <Routes>
    <Route
      element={
        // <div style={{ background: "red" }}>
        //   {/* <LayoutHeader header={dataHeader} /> */}
        //   <Outlet />
        // </div>
        <Layout style={{ background: "red" }}>
          {/* <LayoutHeader header={dataHeader} /> */}
          <Outlet />
        </Layout>
      }
    >
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Route>
  </Routes>
);

export default App;
