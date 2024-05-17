import { makeFontFamily } from "@buttery/tokens/js";
import type { MetaFunction } from "@remix-run/cloudflare";
import { forwardRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!"
    }
  ];
};

const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  ({ children, style, ...restProps }, ref) => {
    return (
      <button
        {...restProps}
        style={{ fontFamily: makeFontFamily("heading") }}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix (with Vite and Cloudflare)</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
            style={{ fontFamily: makeFontFamily("body") }}
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
