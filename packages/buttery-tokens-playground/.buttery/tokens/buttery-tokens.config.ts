import { defineTokensConfig } from "@buttery/tokens";

export default defineTokensConfig({
  "runtime": {
    "namespace": "replace-me",
    "prefix": "--buttery",
    "strict": true,
    "suppressStrictWarnings": false
  },
  "gridSystem": 4,
  "font": {
    "baseSize": 16,
    "families": {},
    "fallback": "system-ui, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
    "weights": {},
    "variants": {}
  },
  "breakpoints": {
    "phone": 375,
    "tablet": 768,
    "desktop": 1280
  },
  "color": {
    "brand": {
      "type": "manual",
      "colors": {
        "primary": {
          "hex": "#5A29E0",
          "variants": 10
        },
        "brand3": {
          "hex": "#c11f1f",
          "variants": 10
        }
      }
    },
    "neutral": {}
  },
  "custom": {}
});
