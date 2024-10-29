---
"@buttery/docs": patch
"@buttery/cli": patch
---

Pattern matches the route against the manifest to serve the correct static assets

This changeset adjusts the ordering of how the production request is handled in the cloudflare functions directory when you deploy a `@buttery/docs` application to Cloudflare Pages. Previously, the handler was searching for a specific namespace which led to the exclusion of specific assets (in the bugs case images). Instead, the handler now attempts to match the pathname against the buttery manifest which in turns tries to render the SSR app first instead of the other way round.

```ts
// Get only the route paths
const routes = Object.values(bManifest).map(
  (manifestEntry) => manifestEntry.routePath
);

// try the route first
if (routes.includes(pathname)) {
  try {
  } catch {}
}

// try the asset fetcher last
try {
  const asset = await context.env.ASSETS.fetch(context.request);
  return asset;
} catch (error) {
  console.error(`Error serving static file: ${pathname}`, error);
  return new Response("Not Found", { status: 404 });
}
```

If the path doesn't match anything in the buttery manifest we fallback to trying to render any static assets that we're included in the client build. Eventually we throw a 404 if we can't find anything and a 500 of the route doesn't render correctly.
