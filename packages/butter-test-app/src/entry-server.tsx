import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export function render(url: string) {
  // Render the app to a string using React's server renderer
  const html = ReactDOMServer.renderToReadableStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  return html;
}
