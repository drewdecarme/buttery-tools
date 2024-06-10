import type { Preview } from "@storybook/react";
import "@buttery/tokens/_docs/index.css";
import { makeFontFamily } from "@buttery/tokens/_docs";
import { css } from "@linaria/core";
import React from "react";

const globalStyles = css`
  font-family: ${makeFontFamily("body")};
`;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={globalStyles}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
