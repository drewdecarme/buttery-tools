import { defineTokensConfig } from "@buttery/tokens"
export default defineTokensConfig({
  "runtime": {
    "namespace": "pg",
    "prefix": "pg",
    "strict": false,
    "suppressStrictWarnings": false
  },
  "gridSystem": 4,
  "font": {
    "baseSize": 16,
    "families": {
      "heading": "Roboto"
    },
    "weights": {
      "regular": 400
    },
    "variants": {}
  },
  "breakpoints": {
    "phone-sm": 320,
    "phone": 375,
    "phone-lg": 414,
    "tablet-sm": 480,
    "tablet": 768,
    "tablet-lg": 1024,
    "desktop-sm": 1200,
    "desktop": 1280,
    "desktop-lg": 1400
  },
  "color": {
    "brand": {
      "type": "manual",
      "colors": {}
    },
    "neutral": {}
  }
})
