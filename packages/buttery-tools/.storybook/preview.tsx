import type { Preview } from "@storybook/react";
import "@buttery/tokens/docs/index.css";
import "@buttery/tokens/playground/index.css";

import React from "react";

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
      <div>
        <Story />
      </div>
    ),
  ],
};

export default preview;
