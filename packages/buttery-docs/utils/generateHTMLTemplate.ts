export function generateHTMLTemplate({
  cssLinks,
  jsScripts,
  metaTags,
}: {
  cssLinks: string[];
  jsScripts: string[];
  metaTags: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!--ssr-entry-->
    ${cssLinks.reduce<string>(
      (accum, href) =>
        accum.concat(`<link rel="stylesheet" href="${href}" />\n`),
      ""
    )}
    ${metaTags}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
      rel="stylesheet"
    />
    <style>
      html, body {
        padding: 0;
        margin: 0;
      }
    </style>
  </head>
  <body>
  <div id="root"><!--ssr-outlet--></div>
    
  </body>
   
  ${jsScripts.reduce<string>(
    (accum, src) =>
      accum.concat(`<script type="module" src="${src}"></script>`),
    ""
  )}
</html>
`;
}
