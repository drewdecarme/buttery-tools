import { type ComponentType, type FC, useEffect, useState } from "react";

export const CodeBlock: FC<{ dxSrc: string }> = ({ dxSrc }) => {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Dynamically import the module from the provided URL
        const module = await import(/* @vite-ignore */ dxSrc);
        console.log(module);
        // Assume the component is the default export of the module
        setComponent(() => module.default);

        // Fetch the code
        const response = await fetch(dxSrc);
        const codeText = await response.text();
        setCode(codeText);
      } catch (error) {
        console.error("Error loading component:", error);
      }
    };

    loadComponent();
  }, [dxSrc]);

  if (!Component) {
    return <div>Loading...</div>;
  }

  return <Component />;
};
