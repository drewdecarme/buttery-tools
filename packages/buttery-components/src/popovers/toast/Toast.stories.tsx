import { randParagraph } from "@ngneat/falso";
import type { Meta } from "@storybook/react";

import { styled } from "@linaria/react";
import type { FC } from "react";
import { Toaster } from "./Toaster";
import { useToast } from "./toast.useToast";

const meta: Meta = {
  title: "Popovers / Toast",
} satisfies Meta<typeof meta>;

export default meta;

const SDiv = styled("div")`
  width: 400px;
  padding: 16px;
  border-radius: 8px;

  &.success {
    background-color: green;
  }

  &.error {
    background-color: red;
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
