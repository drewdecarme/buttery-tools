import type { GetConfigHistoryApiResponse } from "artifacts/tokens/playground/server";
import { useEffect, useState } from "react";
import { apiClient } from "../../api";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  useDrawer,
} from "../../components/dialog";
import {
  VersionHistory,
  VersionHistoryList,
  VersionHistoryListItem,
} from "../../components/version-history";
import { ActionBarButton } from "./ActionBarButton";

export function ActionBarActionVersionHistory() {
  const { openDrawer, drawerRef } = useDrawer();
  const [history, setHistory] = useState<GetConfigHistoryApiResponse>([]);

  useEffect(() => {
    async function getHistory() {
      try {
        const history = await apiClient.config.getConfigHistory();
        setHistory(history.reverse());
      } catch (error) {}
    }
    getHistory();
  }, []);

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
                  data-index={history.length - (i + 1)}
                />
              ))}
            </VersionHistoryList>
          </VersionHistory>
        </DrawerBody>
      </Drawer>
      <ActionBarButton
        type="button"
        onClick={openDrawer}
        dxVariant="secondary"
        dxIcon="clock-rewine"
      >
        Version History
      </ActionBarButton>
    </>
  );
}
