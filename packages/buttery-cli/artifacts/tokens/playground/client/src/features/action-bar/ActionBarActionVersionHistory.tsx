import type { GetConfigHistoryApiResponse } from "artifacts/tokens/playground/server";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../../api";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  useDrawer,
} from "../../components/dialog";
import { useToast } from "../../components/toast";
import {
  VersionHistory,
  VersionHistoryList,
  VersionHistoryListItem,
} from "../../components/version-history";
import { ActionBarButton } from "./ActionBarButton";

export function ActionBarActionVersionHistory() {
  const { openDrawer, drawerRef } = useDrawer();
  const [history, setHistory] = useState<GetConfigHistoryApiResponse>([]);
  const { create } = useToast();

  const getHistory = useCallback<() => Promise<void>>(async () => {
    try {
      const res = await apiClient.config.getConfigHistory();
      setHistory(res.reverse());
    } catch (error) {
      create({
        message: "There was an error when trying to fetch the version history.",
        variant: "error",
      });
    }
  }, [create]);

  const handleOpenDrawer = useCallback(async () => {
    await getHistory();
    openDrawer(undefined);
  }, [openDrawer, getHistory]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  return (
    <>
      <Drawer ref={drawerRef} dxOrientation="right-to-left" dxSize="md">
        <DrawerHeader dxTitle="Version History" />
        <DrawerBody>
          <VersionHistory>
            <VersionHistoryList>
              {history.map((entry, i) => (
                <VersionHistoryListItem
                  key={entry.date}
                  dxDate={entry.date}
                  dxTitle={entry.title}
                  data-index={history.length - (i + 1)}
                />
              ))}
            </VersionHistoryList>
          </VersionHistory>
        </DrawerBody>
      </Drawer>
      <ActionBarButton
        type="button"
        onClick={handleOpenDrawer}
        dxVariant="secondary"
        dxIcon="clock-rewine"
      >
        Version History
      </ActionBarButton>
    </>
  );
}
