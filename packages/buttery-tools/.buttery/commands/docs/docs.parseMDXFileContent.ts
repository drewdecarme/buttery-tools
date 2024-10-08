import rehypeParse from "rehype-parse";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { ButteryDocsGraphTOC } from "./docs.types";

export function parseMDXFileContent(markdownContent: string) {
  const file = unified()
    // @ts-expect-error There's some weird mismatch between types
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkRehype)
    .use(rehypeSlug)
    // @ts-expect-error There's some weird mismatch between types
    .use(rehypeStringify)
    .processSync(markdownContent);
  const tree = unified()
    // @ts-expect-error There's some weird mismatch between types
    .use(rehypeParse, { fragment: true })
    .parse(file.toString());

  const toc: ButteryDocsGraphTOC[] = [];
  const stack: ButteryDocsGraphTOC[] = [];

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  visit(tree, "element", (node: any) => {
    if (
      node.tagName.match(/^h[2-3]$/) &&
      node.properties &&
      node.properties.id
    ) {
      const level = Number.parseInt(node.tagName[1], 10);
      const title = node.children
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .map((child: any) => {
          if (child.type === "text") return child.value;
          if (child.type === "h1") return "";
          if (
            child.type === "element" &&
            (child.tagName === "a" || child.tagName === "code")
          ) {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            return child.children.map((aChild: any) => aChild.value).join("");
          }
          return "";
        })
        .join("");
      const link = `#${node.properties.id}`;
      const headerItem: ButteryDocsGraphTOC = {
        level,
        title,
        link,
        children: []
      };

      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length) {
        stack[stack.length - 1].children.push(headerItem);
      } else {
        toc.push(headerItem);
      }

      stack.push(headerItem);
    }
  });

  return { toc };
}
