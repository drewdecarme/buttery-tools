import { randFullName, randIceHockeyTeam, randJobTitle } from "@ngneat/falso";
import type { Meta } from "@storybook/react";
import { useRef } from "react";
import { breakpointMap, useBreakpoint } from "./__archive/hook.useBreakpoint";
import { useCarousel } from "./useCarousel/hook.useCarousel";
import { useToggle } from "./useToggle/hook.useToggle";

const meta: Meta = {
  title: "Utils / Hooks",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;

export const UseToggle = () => {
  const [isOpen, toggle] = useToggle();

  return (
    <button type="button" onClick={toggle}>
      Click to {isOpen ? "close" : "open"}
    </button>
  );
};

export const UseCarousel = () => {
  const itemsRef = useRef(
    [...new Array(5)].map(() => ({
      name: randFullName(),
      job: randJobTitle(),
      favIceHockeyTeam: randIceHockeyTeam(),
    }))
  );
  const { currentItem, next, prev } = useCarousel(itemsRef.current);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          gap: "1rem",
          width: "min-content",
          margin: "0 auto",
        }}
      >
        <button type="button" onClick={prev}>
          back
        </button>
        <button type="button" onClick={next}>
          forward
        </button>
      </div>
      <pre
        style={{
          padding: " 1rem",
          fontSize: "1rem",
          background: "#ccc",
          borderRadius: ".5rem",
        }}
      >
        {JSON.stringify(currentItem, null, 2)}
      </pre>
    </div>
  );
};

export const UseBreakpoint = () => {
  const shouldRender = useBreakpoint("mobile");
  const shouldRenderBetween = useBreakpoint({ from: "tablet", to: "desktop" });
  console.log("shouldRenderBetween", shouldRenderBetween);
  const shouldRenderMax = useBreakpoint("desktop");

  return (
    <div
      style={{
        maxWidth: "50ch",
      }}
    >
      <div>
        Current Width:{" "}
        <code>
          <strong>
            {typeof window !== "undefined" && window.innerWidth}px
          </strong>
        </code>
      </div>
      <br />
      The box should turn{" "}
      <span
        style={{
          color: "blue",
          fontWeight: "bold",
        }}
      >
        BLUE
      </span>{" "}
      when the viewport:
      <ul>
        <li>
          GREATER THAN:{" "}
          <code>
            <strong>{breakpointMap.mobile}px</strong>
          </code>
        </li>
      </ul>
      <br />
      <div
        style={{
          height: "2rem",
          width: "100%",
          background: shouldRender ? "blue" : "#ccc",
        }}
      />
      <br />
      <br />
      <div>
        The box should turn{" "}
        <span
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          GREEN
        </span>{" "}
        when the viewport:
        <ul>
          <li>
            GREATER THAN:&nbsp;
            <code>
              <strong>{breakpointMap.tablet}px</strong>
            </code>
          </li>
          <li>
            LESS THAN OR EQUAL TO:&nbsp;
            <code>
              <strong>{breakpointMap.desktop - 1}px</strong>
            </code>
          </li>
        </ul>
        <div
          style={{
            height: "2rem",
            width: "100%",
            background: shouldRenderBetween ? "green" : "#ccc",
          }}
        />
      </div>
      <br />
      <br />
      <div>
        The box should turn{" "}
        <span
          style={{
            color: "red",
            fontWeight: "bold",
          }}
        >
          RED
        </span>{" "}
        when the viewport:
        <ul>
          <li>
            GREATER THAN:{" "}
            <code>
              <strong>{breakpointMap.desktop}px</strong>
            </code>
          </li>
        </ul>
      </div>
      <br />
      <div
        style={{
          height: "2rem",
          width: "100%",
          background: shouldRenderMax ? "red" : "#ccc",
        }}
      />
    </div>
  );
};
