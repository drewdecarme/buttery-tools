import { render } from "../dist/entry-server.js";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Render the React app to a string
  const appHtml = render(url.pathname);

  // Return the HTML response
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite SSR App</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="/src/entry-client.tsx"></script>
      </body>
    </html>
    `,
    {
      headers: { "Content-Type": "text/html" }
    }
  );
}
