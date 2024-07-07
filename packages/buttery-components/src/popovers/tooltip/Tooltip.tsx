import { styled } from "@linaria/react";
import type { FC, MouseEventHandler, ReactElement, RefCallback } from "react";
import React, { useCallback, useRef } from "react";
import { usePopover } from "../popover.usePopover";

type TooltipSharedProps = Pick<
  JSX.IntrinsicElements["div"],
  "className" | "style"
> & {
  children: ReactElement<HTMLButtonElement>;
};
type TooltipCustomProps =
  | {
      /**
       * Tooltip exists as a label that describes a control. It is intended
       * to be a simple description of the control that otherwise would have
       * a visible label but otherwise is hidden due to design or space.
       * @example "Notifications"
       */
      dxType: "label";
      /**
       * The string that will accessibly tie the control and the tooltip
       * label together. This is required for accessibility reasons.
       */
      dxId: string;
      /**
       * The string of text that should be displayed when the control
       * is hovered or focused
       */
      dxLabel: string;
    }
  | {
      /**
       * Tooltip exists as an extra clarification for a control. Provides
       * supplementary descriptions or text to better guide the user
       * on how to do something with a particular control
       * @example "View notifications and manage settings"
       */
      dxType: "description";
    };
export type TooltipProps = TooltipSharedProps & TooltipCustomProps;

const SDiv = styled("div")`
  &:popover-open {
    inset: unset;
    border: 0;
    padding: 0;
    margin: 0;
    inset-inline-start: unset;
  }
`;

export const Tooltip: FC<TooltipProps> = ({
  children,
  className,
  style,
  ...restProps
}) => {
  const { popoverRef, handlers } = usePopover();

  switch (restProps.dxType) {
    case "label":
      return (
        <>
          {React.cloneElement(React.Children.only(children), {
            // @ts-expect-error string's aren't recognized. still valid though
            "aria-labelledby": restProps.dxId,
            ...handlers,
          })}
          <SDiv
            role="tooltip"
            id={restProps.dxId}
            ref={popoverRef}
            style={style}
            className={className}
          >
            {restProps.dxLabel}
          </SDiv>
        </>
      );

    default:
      break;
  }
};
