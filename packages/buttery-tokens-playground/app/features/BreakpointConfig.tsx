import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { useCallback } from "react";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";

import { VariantEmpty } from "~/components/VariantEmpty";
import { IconPlusSign } from "~/icons/IconPlusSign";
import { Button } from "~/components/Button";

import { useConfigurationContext } from "./Config.context";
import type { OnResponseBreakpointAction } from "./config.utils.response";
import { BreakpointConfigVariant } from "./BreakpointConfigVariant";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function BreakpointConfig() {
  const {
    setResponse,
    response: { breakpoints },
  } = useConfigurationContext();

  const handleAction = useCallback<OnResponseBreakpointAction>(
    (args) => {
      switch (args.action) {
        case "addBreakpointDirection":
          setResponse((draft) => {
            const entires = Object.entries(draft.breakpoints);
            const newIndex =
              args.direction === "above"
                ? args.referenceIndex
                : args.referenceIndex + 1;

            const newValue =
              args.direction === "above"
                ? entires[args.referenceIndex][1].value - 1
                : entires[args.referenceIndex][1].value + 1;

            entires.splice(newIndex, 0, [
              generateGUID(),
              {
                name: `breakpoint${newIndex}`,
                value: newValue,
              },
            ]);
            draft.breakpoints = Object.fromEntries(entires);
          });
          break;

        case "addBreakpoint":
          setResponse((draft) => {
            draft.breakpoints = {
              ...draft.breakpoints,
              [generateGUID()]: { name: `mobile`, value: 480 },
            };
          });
          break;

        case "deleteBreakpoint":
          setResponse((draft) => {
            delete draft.breakpoints[args.id];
          });
          break;

        case "updateBreakpoint":
          setResponse((draft) => {
            draft.breakpoints[args.id].name = args.name;
            draft.breakpoints[args.id].value = args.value;
          });
          break;

        default:
          return exhaustiveMatchGuard(args);
      }
    },
    [setResponse]
  );

  const handleAddBreakpoint = useCallback(() => {
    handleAction({ action: "addBreakpoint" });
  }, [handleAction]);

  const breakpointsEntires = Object.entries(breakpoints);

  if (breakpointsEntires.length === 0) {
    return (
      <VariantEmpty dxMessage="No breakpoints have been added yet">
        <Button
          dxVariant="outlined"
          dxColor="secondary"
          DXIconStart={IconPlusSign}
          onClick={handleAddBreakpoint}
        >
          Click to add a variant
        </Button>
      </VariantEmpty>
    );
  }

  return (
    <ul className={styles}>
      {Object.entries(breakpoints).map(([breakpointId, breakpoint], index) => (
        <li key={breakpointId}>
          <BreakpointConfigVariant
            breakpoint={breakpoint}
            breakpointId={breakpointId}
            breakpointIndex={index}
            onAction={handleAction}
          />
        </li>
      ))}
    </ul>
  );
}
