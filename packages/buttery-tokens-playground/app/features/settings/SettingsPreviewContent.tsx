import { useMemo } from "react";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/tokens/playground";

import { CodeBlock } from "~/components/CodeBlock";

import { useConfigurationContext } from "../Config.context";

const styles = css`
  display: flex;
  flex-direction: column;
  gap: ${makeRem(32)};
`;

export function SettingsPreviewContent() {
  const {
    settings: { namespace, prefix },
  } = useConfigurationContext();

  const namespaceCode = useMemo(() => {
    return `// Namespace

// When 'buttery tokens build' is run, the tokens are built to a directory inside
// of the "@buttery/tokens" distribution directory and exported using the "exports"
// key in the s"package.json". This allows the tokens to be built and then
// absolutely imported without a lot of alias gymnastics

import { makeColor, makeSize, makeRem } from "@buttery/tokens/${namespace}"`;
  }, [namespace]);

  const prefixCode = useMemo(() => {
    return `/* Prefix

* When 'buttery tokens build' is run, the values in the schema are read, compiled
* and built. Along with the creation of the utilities, the custom CSS properties
* that correspond to those values are also created at the root and _prefixed_
* with a string that will avoid clashing with other 3rd party CSS custom properties
*/

:root {
  --${prefix}-color-primary-50: #ffff92;
  --${prefix}-color-primary-50-hex: #ffff92;
  --${prefix}-color-primary-50-hsl: 60, 100, 79;
  --${prefix}-color-primary-50-rgb: 255, 255, 146;
  --${prefix}-color-primary-100: #fbf07c;
  --${prefix}-color-primary-100-hex: #fbf07c;
  --${prefix}-color-primary-100-hsl: 55, 94, 74;
  --${prefix}-color-primary-100-rgb: 251, 240,
  /* etc... */
}
`;
  }, [prefix]);

  return (
    <div className={styles}>
      <div>
        <CodeBlock dxCode={namespaceCode} dxOptions={{ lang: "typescript" }} />
      </div>
      <div>
        <CodeBlock dxCode={prefixCode} dxOptions={{ lang: "css" }} />
      </div>
    </div>
  );
}
