import { makeColor, makeCustom, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { NavLink, Outlet, useLoaderData } from "react-router";
import { tryHandle } from "@buttery/utils/isomorphic";

import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { NavTabs } from "~/components/NavTabs";
import { IconCopy } from "~/icons/IconCopy";
import { IconDownload05 } from "~/icons/IconDownload05";
import { ConfigurationProvider } from "~/features/Config.context";
import { ConfigPreview } from "~/features/ConfigPreview";
import { getButteryConfig } from "~/utils/util.getLocalConfig";
import { ConfigSave } from "~/features/ConfigSave";
import { errors } from "~/utils/util.error-modes";

const styles = css`
  position: sticky;
  top: 0;
  background: white;
  z-index: 11;

  & > * {
    margin: 0 auto;
    max-width: ${makeCustom("layout-max-width")};
  }

  .page-header {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
    padding: ${makeRem(20)} ${makeCustom("layout-gutters")};

    h2 {
      margin: 0;
    }

    p {
      font-size: ${makeRem(12)};
      margin-bottom: 0;
      color: ${makeColor("neutral-light", { opacity: 0.8 })};
    }

    .actions {
      display: flex;
      gap: ${makeRem(16)};
    }
    & + * {
    }
  }

  .tabs {
    padding: 0 ${makeCustom("layout-gutters")};
  }
`;

export async function loader() {
  const config = await tryHandle(getButteryConfig)();
  if (config.hasError) {
    throw errors.API_ERROR(500, config.error);
  }

  return { config: config.data };
}

export default function AppConfigRoute() {
  const { config } = useLoaderData<typeof loader>();

  return (
    <ConfigurationProvider originalConfig={config}>
      <div className={styles}>
        <div className="page-header">
          <div>
            <h2>Configuration</h2>
          </div>
          <div className="actions">
            <ButtonGroup>
              <Button dxVariant="outlined" DXIconStart={IconCopy}>
                Copy
              </Button>
              <Button dxVariant="outlined" DXIconStart={IconDownload05}>
                Export
              </Button>
              <ConfigPreview />
            </ButtonGroup>
            <ButtonGroup>
              <ConfigSave />
            </ButtonGroup>
          </div>
        </div>
        <NavTabs>
          <ul className="tabs">
            <li>
              <NavLink to="." end>
                Color
              </NavLink>
            </li>
            <li>
              <NavLink to="./size-and-spacing">Size & Spacing</NavLink>
            </li>
            <li>
              <NavLink to="./typography">Typography</NavLink>
            </li>
            <li>
              <NavLink to="./response">Response</NavLink>
            </li>
            <li>
              <NavLink to="./custom">Custom</NavLink>
            </li>
            <li>
              <NavLink to="./settings">Settings</NavLink>
            </li>
          </ul>
        </NavTabs>
      </div>
      <Outlet />
    </ConfigurationProvider>
  );
}
