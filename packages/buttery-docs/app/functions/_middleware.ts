import { render } from "../build/server/entry.server.js";

export async function onRequest(context) {
  const { request } = context;
  const { pathname } = new URL(request.url);

  // Check for static assets
  if (
    pathname.startsWith("/assets") ||
    pathname.startsWith("/client") ||
    pathname.includes(".ico")
  ) {
    try {
      return await context.env.ASSETS.fetch(request);
    } catch (error) {
      console.error(`Error serving static file: ${pathname}`, error);
      return new Response("Not Found", { status: 404 });
    }
  }

  try {
    // Generate the SSR HTML using the `render` function from the server bundle
    const appHtml = render(pathname);
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite SSR App</title>
    <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon.ico"
      />
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <!-- Reference the client-side bundle -->
    <script type="module" src="/client.js"></script>
  </body>
</html>`;

    return new Response(htmlTemplate, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error during SSR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
