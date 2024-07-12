import { makeRem } from "@buttery/tokens/playground";
import { clsx } from "clsx";
import { type FormEventHandler, forwardRef, useCallback } from "react";
import { useFetcher } from "react-router-dom";
import { apiClient } from "../../api";
import { Button } from "../../components/buttons";
import { InputText } from "../../components/inputs";
import {
  Menu,
  MenuBody,
  MenuFooter,
  MenuHeader,
  useMenu,
} from "../../components/menu";
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

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      try {
        closeMenu();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("version-name") as string;
        const res = await apiClient.config.saveConfig({
          title,
          config: liveConfig,
        });
        create({
          message: `Successfully saved version: "${res.title}"!`,
          variant: "success",
        });
      } catch (error) {
        create({
          message: "There was an error when trying to save the config",
          variant: "error",
        });
      }
    },
    [liveConfig, create, closeMenu]
  );

  return (
    <>
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
        <fetcher.Form
          onSubmit={handleSubmit}
          {...restProps}
          className={clsx(className)}
          ref={ref}
        >
          <MenuHeader>
            <h2>Save a version</h2>
          </MenuHeader>
          <MenuBody>
            <InputText
              dxSize="sm"
              dxLabel="Describe the changes in this version"
              name="version-name"
              pattern="[a-zA-Z0-9\s]*"
              title="Please enter only letters, numbers, and spaces."
              required
            />
          </MenuBody>
          <MenuFooter>
            <Button
              type="button"
              dxVariant="text"
              dxSize="sm"
              onClick={closeMenu}
            >
              Close
            </Button>
            <Button type="submit" dxVariant="primary" dxSize="sm">
              Save
            </Button>
          </MenuFooter>
        </fetcher.Form>
      </Menu>
    </>
  );
});
