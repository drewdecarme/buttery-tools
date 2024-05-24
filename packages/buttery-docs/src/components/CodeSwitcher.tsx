import type { ReactNode } from "react";

export function CodeSwitcher({ children }: { children: ReactNode }) {
  return (
    <div>
      code here
      <pre>{children}</pre>
    </div>
  );
}
