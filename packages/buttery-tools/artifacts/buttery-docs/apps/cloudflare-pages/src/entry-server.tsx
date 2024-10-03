import { renderToReadableStream } from "react-dom/server.browser";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export async function render(url: string) {
  // Render the app to a ReadableStream using React's server renderer
  const stream = await renderToReadableStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  // Wait until the stream is ready before returning it
  await stream.allReady;

  return stream;
}
