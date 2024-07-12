import { makeRem } from "@buttery/tokens/playground";
import { clsx } from "clsx";
import { type FormEventHandler, forwardRef, useCallback } from "react";
import { useFetcher } from "react-router-dom";
import { apiClient } from "../../api";
import { Button } from "../../components/buttons";
import { Menu, MenuFooter, MenuHeader, useMenu } from "../../components/menu";
import { useToast } from "../../components/toast";
import { useConfigContext } from "../config";
import { ActionBarButton } from "./ActionBarButton";

export type ActionBarActionSavePropsNative = Omit<
  JSX.IntrinsicElements["form"],
  "method" | "encType"
>;
export type ActionBarActionSaveProps = ActionBarActionSavePropsNative;

export const ActionBarActionSave = forwardRef<
  HTMLFormElement,
  ActionBarActionSaveProps
>(function ActionBarActionSave({ children, className, ...restProps }, ref) {
  const { liveConfig } = useConfigContext();
  const { menuRef, targetRef, toggleMenu, closeMenu } =
    useMenu<HTMLButtonElement>({
      dxArrow: {
        size: 16,
        color: "white",
      },
      dxPosition: "bottom-right",
    });
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
    <fetcher.Form
      onSubmit={handleSubmit}
      {...restProps}
      className={clsx(className)}
      ref={ref}
    >
      <ActionBarButton
        type="button"
        ref={targetRef}
        dxIcon="floppy-disk"
        dxVariant="primary"
        onClick={toggleMenu}
      >
        Save
      </ActionBarButton>
      <Menu
        ref={menuRef}
        targetRef={targetRef}
        style={{
          width: makeRem(300),
        }}
      >
        <MenuHeader>
          <h2>Save a version</h2>
        </MenuHeader>
        <div>
          <label>
            Describe the changes in this version
            <input type="text" name="version-name" />
          </label>
        </div>

        <MenuFooter>
          <Button
            type="button"
            onClick={closeMenu}
            dxVariant="text"
            dxSize="sm"
          >
            Close
          </Button>
          <Button
            type="submit"
            name="intent"
            value="save"
            dxVariant="primary"
            dxSize="sm"
          >
            Save
          </Button>
        </MenuFooter>
      </Menu>
    </fetcher.Form>
  );
});
