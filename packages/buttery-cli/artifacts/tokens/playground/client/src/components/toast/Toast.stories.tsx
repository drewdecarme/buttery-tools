import { randParagraph } from "@ngneat/falso";
import type { Meta } from "@storybook/react";

import { Toaster, useToast } from "./index";

const meta: Meta = {
  title: "Playground / Toast",
} satisfies Meta<typeof meta>;

export default meta;

export const Example = () => {
  const { create } = useToast();
  return (
    <>
      <button
        type="button"
        onClick={() => create({ variant: "error", message: randParagraph() })}
      >
        Create toast
      </button>
      <Toaster />
    </>
  );
};
