import { renderToString } from "react-dom/server.browser";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export function render(url: string) {
  // Render the app to a string using React's server renderer
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  return html;
}
