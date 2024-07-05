import { IconComponent } from "@buttery/icons";
import { makeRem } from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import { clsx } from "clsx";
import { type FormEventHandler, forwardRef, useCallback } from "react";
import { useFetcher } from "react-router-dom";
import { apiClient } from "../../api";
import { useConfigContext } from "../config";
import { ActionBarButton } from "./ActionBarButton";
import { ActionBarVersionHistory } from "./ActionBarVersionHistory";

export type ActionBarPropsNative = Omit<
  JSX.IntrinsicElements["form"],
  "method" | "encType"
>;
export type ActionBarProps = ActionBarPropsNative;

const formStyles = css`
  display: flex;
  align-items: center;
  gap: ${makeRem(8)};
`;

export const ActionBar = forwardRef<HTMLFormElement, ActionBarProps>(
  function ActionBar({ children, className, ...restProps }, ref) {
    const { liveConfig } = useConfigContext();
    const fetcher = useFetcher();

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
      async (e) => {
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");

        switch (name) {
          case "save":
            await apiClient.config.saveConfig(liveConfig);
            break;

          default:
            console.log(`No action specified for ${name}`);
            break;
        }

        await apiClient.config.saveConfig(liveConfig);
      },
      [liveConfig]
    );

    return (
      <fetcher.Form
        onSubmit={handleSubmit}
        {...restProps}
        className={clsx(formStyles, className)}
        ref={ref}
      >
        <ActionBarVersionHistory />
        <ActionBarButton type="submit" name="save">
          <IconComponent icon="floppy-disk" />
        </ActionBarButton>
      </fetcher.Form>
    );
  }
);
