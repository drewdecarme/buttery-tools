import React from "react";
import { type ReactNode, useState } from "react";

export function InteractivePreview({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <ul>
        <li>
          <button type="button" onClick={() => setActiveTab(0)}>
            Preview
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setActiveTab(1)}>
            Code
          </button>
        </li>
      </ul>
      <div>{React.Children.toArray(children)[activeTab]}</div>
    </div>
  );
}
