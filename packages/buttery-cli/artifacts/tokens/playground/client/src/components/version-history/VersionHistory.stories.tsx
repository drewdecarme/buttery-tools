import type { Meta, StoryObj } from "@storybook/react";

import { VersionHistory } from "./VersionHistory";
import { VersionHistoryList } from "./VersionHistoryList";
import { VersionHistoryListItem } from "./VersionHistoryListItem";

const meta: Meta = {
  title: "Playground / Version History",
  component: VersionHistory,
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();

const dates = [...new Array(10)].map((_d, i) =>
  new Date(now.setDate(now.getDate() + i)).toISOString()
);

export const Basic = () => {
  return (
    <VersionHistory>
      <VersionHistoryList>
        {dates.map((date) => (
          <VersionHistoryListItem key={date} dxDate={date} />
        ))}
      </VersionHistoryList>
    </VersionHistory>
  );
};
