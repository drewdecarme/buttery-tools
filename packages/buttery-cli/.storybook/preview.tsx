import type { Preview } from "@storybook/react";
import "../artifacts/tokens/.buttery-tokens/docs/index.css";
import "../artifacts/tokens/.buttery-tokens/playground/index.css";
import "@buttery/components/css";

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
