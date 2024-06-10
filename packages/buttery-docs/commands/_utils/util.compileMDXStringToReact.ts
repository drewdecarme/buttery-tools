import { compile } from "@mdx-js/mdx";
import { VFile } from "vfile";

export async function compileMDXStringToReact(mdxString: string) {
  const file = new VFile({ path: "content.mdx", value: mdxString });
  const compiled = await compile(file, { outputFormat: "function-body" });
  const compiledCode = String(compiled);

  const content = new Function(`${compiledCode}; return MDXContent;`)();
  console.log({ content });
  return content;
}
