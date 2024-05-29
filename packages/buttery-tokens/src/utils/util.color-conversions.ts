export function hsbToHsl(h: number, s: number, b: number) {
  // Normalize HSB values
  const hue = h;
  const saturation = s / 100;
  const brightness = b / 100;

  // Calculate Lightness
  let lightness = ((2 - saturation) * brightness) / 2;

  // Calculate Saturation
  let sl: number;
  if (lightness === 0 || lightness === 1) {
    sl = 0;
  } else {
    sl = (brightness - lightness) / Math.min(lightness, 1 - lightness);
  }

  // Convert back to percentages
  sl *= 100;
  lightness *= 100;

  return {
    h: hue,
    s: sl,
    l: lightness
  };
}

export function hslToHex(h: number, s: number, l: number) {
  // Normalize HSL values
  const hue = h / 360;
  const saturation = s / 100;
  const lightness = l / 100;

  let r: number;
  let g: number;
  let b: number;

  if (saturation === 0) {
    // Achromatic color (gray)
    r = g = b = lightness;
  } else {
    const hueToRgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q =
      lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;

    r = hueToRgb(p, q, hue + 1 / 3);
    g = hueToRgb(p, q, hue);
    b = hueToRgb(p, q, hue - 1 / 3);
  }

  // Convert RGB to HEX
  const toHex = (x: number): string => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hsbToHex(h: number, s: number, b: number) {
  const hsl = hsbToHsl(h, s, b);
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

// Convert HEX to RGB
export function hexToRgb(h: string) {
  // Remove the hash at the start if it's there
  const hex = h.replace(/^#/, "");

  // Parse r, g, b values
  const bigint = Number.parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

// Convert RGB to HSB
function rgbToHsb(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number;
  let s: number;
  let v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  v = Math.round(v * 100);

  return { h, s, b: v };
}

// Convert HEX to HSB
export function hexToHsb(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsb(r, g, b);
}

export function getHueFromHex(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h } = rgbToHsb(r, g, b);
  return h;
}
