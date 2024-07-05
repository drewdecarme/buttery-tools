import { randParagraph } from "@ngneat/falso";
import type { Meta } from "@storybook/react";

import { styled } from "@linaria/react";
import type { FC } from "react";
import { makeColor, makeFontFamily, makeRem } from "#buttery/tokens/playground";
import { Toaster } from "./Toaster";
import { useToast } from "./toast.useToast";

const meta: Meta = {
  title: "Playground / Toast",
} satisfies Meta<typeof meta>;

export default meta;

const SDiv = styled("div")`
  width: ${makeRem(400)};
  padding: ${makeRem(16)};
  border-radius: ${makeRem(8)};
  font-family: ${makeFontFamily("body")};

  &.success {
    background-color: ${makeColor("primary", { variant: "50" })};
    border: ${makeColor("primary")};
  }

  &.error {
    background-color: ${makeColor("danger", { variant: "50" })};
    border: ${makeColor("danger")};
  }
`;

type SampleToastProps = {
  variant: "success" | "error";
  message: string;
};

const ToastComponent: FC<SampleToastProps> = (props) => {
  return <SDiv className={props.variant}>{props.message}</SDiv>;
};

export const Example = () => {
  const { create } = useToast<SampleToastProps>();
  return (
    <>
      <button
        type="button"
        onClick={() => create({ variant: "error", message: randParagraph() })}
      >
        Create toast
      </button>
      <Toaster ToastComponent={ToastComponent} />
    </>
  );
};
