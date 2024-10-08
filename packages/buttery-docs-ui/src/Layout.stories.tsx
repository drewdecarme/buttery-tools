import type { Meta } from "@storybook/react";
import { Layout } from "./Layout";
import { LayoutBody } from "./LayoutBody";
import { LayoutBodyMain } from "./LayoutBodyMain";
import { LayoutBodyNav } from "./LayoutBodyNav";
import { LayoutBodyTOC } from "./LayoutBodyTOC";
import { LayoutHeader } from "./LayoutHeader";

const meta: Meta = {
  title: "Layout",
} satisfies Meta<typeof meta>;

export default meta;

export const DocsLayout = () => {
  return (
    <Layout>
      <LayoutHeader header={undefined} />
      <LayoutBody>
        <LayoutBodyNav graph={{}} />
        <LayoutBodyMain>
          <h1>Hello!</h1>
        </LayoutBodyMain>
        <LayoutBodyTOC tableOfContents={[]} />
      </LayoutBody>
    </Layout>
  );
};
