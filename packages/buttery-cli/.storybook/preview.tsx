import type { Preview } from "@storybook/react";
import "../artifacts/tokens/.buttery-tokens/docs/index.css";
import { bodyCSS } from "../.buttery-docs/components";

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
      <div className={bodyCSS}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
