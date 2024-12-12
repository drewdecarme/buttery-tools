import { forwardRef } from "react";
import { css } from "@linaria/core";
import { classes } from "@buttery/components";
import { makeRem, makeReset } from "@buttery/tokens/playground";

import { ConfigColorSwatch } from "./ConfigColorSwatch";

export type ConfigColorSwatchAddPropsNative = JSX.IntrinsicElements["div"];
export type ConfigColorSwatchAddProps = ConfigColorSwatchAddPropsNative;

const ColorsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={16}
    height={16}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <title>color</title>
    <path
      d="M17.5798 9.71016C17.0765 9.57314 16.5468 9.5 16 9.5C13.4668 9.5 11.3002 11.0699 10.4202 13.2898M17.5798 9.71016C20.1271 10.4036 22 12.7331 22 15.5C22 18.8137 19.3137 21.5 16 21.5C14.4633 21.5 13.0615 20.9223 12 19.9722M17.5798 9.71016C17.851 9.02618 18 8.2805 18 7.5C18 4.18629 15.3137 1.5 12 1.5C8.68629 1.5 6 4.18629 6 7.5C6 8.2805 6.14903 9.02618 6.42018 9.71016M10.4202 13.2898C10.149 13.9738 10 14.7195 10 15.5C10 17.277 10.7725 18.8736 12 19.9722M10.4202 13.2898C8.59146 12.792 7.11029 11.451 6.42018 9.71016M6.42018 9.71016C3.87294 10.4036 2 12.7331 2 15.5C2 18.8137 4.68629 21.5 8 21.5C9.53671 21.5 10.9385 20.9223 12 19.9722"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const styles = css`
  border-style: dashed;

  button {
    ${makeReset("button")};
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${makeRem(8)};
  }
`;

export const ConfigColorSwatchAdd = forwardRef<
  HTMLDivElement,
  ConfigColorSwatchAddProps
>(function ConfigColorSwatchAdd({ children, className, ...restProps }, ref) {
  return (
    <ConfigColorSwatch
      {...restProps}
      className={classes(styles, className)}
      ref={ref}
    >
      <button>
        <ColorsIcon />
        <span>{children}</span>
      </button>
    </ConfigColorSwatch>
  );
});
