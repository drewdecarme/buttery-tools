// global.d.ts
export type {};

declare global {
  interface Window {
    buttery_toasts: Map<string, Record<string, unknown>>;
  }
}
