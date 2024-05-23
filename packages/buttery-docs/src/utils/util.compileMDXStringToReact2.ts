import { compile } from "@mdx-js/mdx";

export async function compileMDXStringToReact(mdxString: string) {
  const mdxCode = await compile(mdxString, { outputFormat: "function-body" });
  const { default: Content } = await import(
    /* webpackIgnore: true */
    `data:text/javascript,${encodeURIComponent(mdxCode.toString())}`
  );
  return Content;
}
