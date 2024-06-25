var n = (t) => `var(--buttery-tokens-font-family-${t})`;
var i = (t) => `var(--buttery-tokens-font-weight-${t})`;
var l = (t) => `${t / 16}rem`;
var c = (t) => {
  const e = t?.from ? `var(--buttery-tokens-breakpoint-${t.from})` : void 0,
    o = t?.to ? `calc(var(--buttery-tokens-breakpoint-${t.to}) - 1px)` : void 0;
  if (e && o) return `@media (min-width: ${e}) and @media (max-width:${o})`;
  if (e && !o) return `@media (min-width: ${e})`;
  if (o && !e) return `@media (max-width: ${o})`;
  throw new Error("You must provide a to or from parameter.");
};
var d = (t, e) => {
  console.log(t, e);
  const o = e?.opacity ?? 1,
    r = e?.variant ? `-${e.variant}` : "";
  return `hsla(var(--buttery-tokens-color-${t}${r}-h), var(--buttery-tokens-color-${t}${r}-s), var(--buttery-tokens-color-${t}${r}-l), ${o})`;
};
var g = (t, e) => {
  const o = e?.opacity ?? 1;
  return `hsla(var(--buttery-tokens-color-static-${t}-h), var(--buttery-tokens-color-static-${t}-s), var(--buttery-tokens-color-static-${t}-l), ${o})`;
};
var a = (t) => {
    throw new Error(`Forgot to include an ${t} in the switch statement`);
  },
  b = (t) => {
    switch (t) {
      case "ul":
        return `
          margin: 0;
          padding: 0;

          li {
            margin: 0;
            padding: 0;
            list-style-type: none;
          }
        `;
      case "button":
        return `
          margin: 0;
          padding: 0;
          border: none;
          background: none;
        `;
      case "body":
        return `
          margin: 0;
          padding: 0;
        `;
      case "anchor":
        return `
          text-decoration: none;
          color: inherit;

          &:visited {
            color: inherit;
          }
        `;
      default:
        return a(t);
    }
  };
var h = (t) => `var(--buttery-tokens-custom-${t})`;
var v = {
  paths: {
    config:
      "/Users/drewdecarme/git/personal/buttery-tools/packages/app-test-tokens/.buttery/config.ts",
    butteryDir:
      "/Users/drewdecarme/git/personal/buttery-tools/packages/app-test-tokens/.buttery",
    rootDir:
      "/Users/drewdecarme/git/personal/buttery-tools/packages/app-test-tokens",
  },
  tokens: {
    importName: "test-tokens",
    gridSystem: 4,
    prefix: "buttery-tokens",
    strict: !0,
    suppressStrictWarnings: !1,
    font: {
      size: 16,
      family: {
        heading:
          'Poppins, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        body: 'Poppins, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      },
      weight: {
        bold: 700,
        "semi-bold": 600,
        medium: 500,
        regular: 400,
        light: 300,
      },
      typography: {},
    },
    breakpoints: {
      "phone-small": 320,
      phone: 375,
      "phone-large": 414,
      "tablet-small": 480,
      tablet: 768,
      "tablet-large": 1024,
      "desktop-small": 1200,
      desktop: 1280,
      "desktop-large": 1400,
    },
    color: {
      mode: "presets",
      tone: "jewel",
      saturation: 83,
      brightness: 76,
      application: {
        hues: { primary: 42, secondary: 170, warning: 60, danger: 359 },
        variants: { mode: "auto", total: 10, scaleMin: 2, scaleMax: 2 },
      },
      neutral: {
        base: "#030305",
        variants: { mode: "auto", total: 10, scaleMin: 5 },
      },
      static: { background: "#fff", surface: "#fff" },
    },
    custom: { "layout-header": 48 },
  },
};
export {
  v as config,
  d as makeColor,
  g as makeColorStatic,
  h as makeCustom,
  n as makeFontFamily,
  i as makeFontWeight,
  l as makeRem,
  b as makeReset,
  c as makeResponsive,
};
