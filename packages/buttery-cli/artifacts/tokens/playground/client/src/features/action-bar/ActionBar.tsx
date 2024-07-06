import { IconComponent } from "@buttery/icons";
import { makeRem } from "@buttery/tokens/docs";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { type FormEventHandler, forwardRef, useCallback } from "react";
import { useFetcher } from "react-router-dom";
import { apiClient } from "../../api";
import { useToast } from "../../components/toast";
import { useConfigContext } from "../config";
import { ActionBarButton } from "./ActionBarButton";
import { ActionBarVersionHistory } from "./ActionBarVersionHistory";

export type ActionBarPropsNative = Omit<
  JSX.IntrinsicElements["form"],
  "method" | "encType"
>;
export type ActionBarProps = ActionBarPropsNative;

const SDiv = styled("div")`
  display: flex;
  align-items: center;
  gap: ${makeRem(4)};
`;

export const ActionBar = forwardRef<HTMLFormElement, ActionBarProps>(
  function ActionBar({ children, className, ...restProps }, ref) {
    const { liveConfig } = useConfigContext();
    const fetcher = useFetcher();
    const { create } = useToast();

    const handleSubmit = useCallback<
      FormEventHandler<HTMLFormElement>
    >(async () => {
      try {
        await apiClient.config.saveConfig(liveConfig);
        create({
          message: "Configuration successfully saved!",
          variant: "success",
        });
      } catch (error) {
        create({
          message: "There was an error when trying to save the config",
          variant: "error",
        });
      }
    }, [liveConfig, create]);

    return (
      <SDiv>
        <ActionBarVersionHistory />
        <fetcher.Form
          onSubmit={handleSubmit}
          {...restProps}
          className={clsx(className)}
          ref={ref}
        >
          <ActionBarButton type="submit" name="intent" value="save">
            <IconComponent icon="floppy-disk" />
          </ActionBarButton>
        </fetcher.Form>
      </SDiv>
    );
  }
);
