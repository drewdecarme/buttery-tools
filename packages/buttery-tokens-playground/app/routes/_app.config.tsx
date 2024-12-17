import { makeColor, makeCustom, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { NavLink, Outlet } from "@remix-run/react";

import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { ConfigurationProvider } from "~/components/Config.context";
import { NavTabs } from "~/components/NavTabs";
import { IconCopy } from "~/icons/IconCopy";
import { IconDownload05 } from "~/icons/IconDownload05";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";

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

export default function AppConfigRoute() {
  return (
    <ConfigurationProvider>
      <div className={styles}>
        <div className="page-header">
          <div>
            <h2>Configure</h2>
            <p>
              Each section allows you to customize each part of the token based
              design system
            </p>
          </div>
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
            <Button
              dxVariant="outlined"
              DXAdornmentStart={<IconCopy dxSize={16} />}
            >
              View
            </Button>
            <Button
              dxVariant="outlined"
              DXAdornmentStart={<IconFloppyDisk dxSize={16} />}
            >
              Save
            </Button>
          </ButtonGroup>
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
