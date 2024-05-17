const tokensConfig = {
  gridSystem: 4,
  prefix: "buttery",
  strict: true,
  suppressStrictWarnings: false,
  font: {
    family: {
      heading:
        'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      body: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    },
    weight: {
      bold: 700,
      "semi-bold": 600,
      medium: 500,
      regular: 400,
      light: 300
    },
    typography: {
      heading1: {
        fontFamily: "heading",
        fontSize: 74,
        lineHeight: 82
      },
      heading2: {
        fontFamily: "heading",
        fontSize: 64,
        lineHeight: 74
      }
    }
  }
};
export default tokensConfig;
