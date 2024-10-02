import { classes } from "@buttery/components";
import { css } from "@linaria/core";
import React from "react";
import {
  type MouseEventHandler,
  forwardRef,
  useCallback,
  useState,
} from "react";

export type PreviewBlockPropsNative = JSX.IntrinsicElements["div"];
export type PreviewBlockProps = PreviewBlockPropsNative;

const containerCSS = css`
  --border-color: #eeeeee;

  width: 100%;
  height: 400px;
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  overflow: auto;

  & > * {
    padding: 0 1rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding: 0.5rem;
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);

    button {
      background: none;
      border: none;
      padding: 0 0.5rem;
      height: 24px;
      border-radius: 1rem;
      border: 1px solid black;
      font-size: 12px;
      cursor: pointer;
      font-family: "Source Sans 3";
      text-transform: capitalize;
      font-weight: 500;
      transition: all 0.15s ease-in-out;

      &.active {
        background: #2192c2;
        color: white;
        border: 1px solid #2192c2;
      }
    }
  }

  .content {
    &.preview {
      display: grid;
      place-content: center;
    }

    &.code {
      background: rgb(30, 30, 30);
      pre {
        padding: 0;
      }
    }
  }
`;

export const PreviewBlock = forwardRef<HTMLDivElement, PreviewBlockProps>(
  function PreviewBlock({ children, className, ...restProps }, ref) {
    const [activeTab, setActiveTab] = useState(0);

    const createSetActiveTab = useCallback<
      (tabIndex: number) => MouseEventHandler<HTMLButtonElement>
    >((index) => () => setActiveTab(index), []);

    return (
      <div
        {...restProps}
        className={classes(className, containerCSS)}
        ref={ref}
      >
        <div className="actions">
          <button
            type="button"
            onClick={createSetActiveTab(0)}
            className={classes({ active: activeTab === 0 })}
          >
            preview
          </button>
          <button
            type="button"
            onClick={createSetActiveTab(1)}
            className={classes({ active: activeTab === 1 })}
          >
            code
          </button>
        </div>
        <div
          className={classes("content", {
            preview: activeTab === 0,
            code: activeTab === 1,
          })}
        >
          {React.Children.toArray(children)[activeTab]}
        </div>
      </div>
    );
  }
);
export default PreviewBlock;
