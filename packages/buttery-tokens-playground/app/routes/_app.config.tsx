import { makeColor, makeCustom, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { NavLink, Outlet, useLoaderData } from "react-router";
import { ConfigSchema } from "@buttery/tokens-utils/schemas";

import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { NavTabs } from "~/components/NavTabs";
import { IconCopy } from "~/icons/IconCopy";
import { IconDownload05 } from "~/icons/IconDownload05";
import { ConfigurationProvider } from "~/features/Config.context";
import { ConfigView } from "~/features/ConfigView";
import { getIsLocalConfig } from "~/utils/util.getLocalConfig";
import { ConfigSave } from "~/features/ConfigSave";

const styles = css`
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;

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
      padding: 0 ${makeCustom("layout-gutters")};
    }
  }

  & + * {
    min-height: 80vh;
  }
`;

export function loader() {
  const localConfig = getIsLocalConfig();
  // local config
  if (typeof localConfig !== "boolean") {
    return {
      config: localConfig.config,
    };
  }

  const parsedConfig = ConfigSchema.safeParse({});
  if (parsedConfig.error) {
    throw parsedConfig.error;
  }
  return {
    config: parsedConfig.data,
  };
}

export default function AppConfigRoute() {
  const { config } = useLoaderData<typeof loader>();

  return (
    <ConfigurationProvider originalConfig={config}>
      <div className={styles}>
        <div className="page-header">
          <div>
            <h2>Configure</h2>
            <p>
              Each section allows you to customize each part of the token based
              design system
            </p>
          </div>
          <div className="actions">
            <ButtonGroup>
              <Button
                dxVariant="outlined"
                DXAdornmentStart={<IconCopy dxSize={16} />}
              >
                Copy
              </Button>
              <Button
                dxVariant="outlined"
                DXAdornmentStart={<IconDownload05 dxSize={16} />}
              >
                Export
              </Button>
              <ConfigView />
            </ButtonGroup>
            <ButtonGroup>
              <ConfigSave />
            </ButtonGroup>
          </div>
        </div>
        <NavTabs>
          <ul>
            <li>
              <NavLink to="." end>
                Color
              </NavLink>
            </li>
            <li>
              <NavLink to="./grid-system">Grid System</NavLink>
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
          </ul>
        </NavTabs>
      </div>
      <Outlet />
    </ConfigurationProvider>
  );
}
