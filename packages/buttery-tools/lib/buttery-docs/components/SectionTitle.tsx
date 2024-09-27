import { makeFontWeight, makeRem } from "@buttery/tokens/docs";

export function SectionTitle({ children }: { children: string }) {
  return (
    <h1>
      <span
        style={{ fontSize: makeRem(14), fontWeight: makeFontWeight("regular") }}
      >
        buttery.
      </span>
      <span>{children}</span>
    </h1>
  );
}
