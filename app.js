/**
 * COLOR TRANSLATOR - STREAMLINED COLOR CONVERTER
 * Feature: Input any color code -> Translate across all formats.
 */

(() => {
  "use strict";

  // Standard 148 CSS Named Colors
  const CSS_COLORS = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
  };

  const HEX_TO_NAME = {};
  for (const [name, hex] of Object.entries(CSS_COLORS)) {
    if (!HEX_TO_NAME[hex]) HEX_TO_NAME[hex] = name;
  }

  const CSS_COLOR_ENTRIES = Object.entries(CSS_COLORS).map(([name, hex]) => {
    const num = parseInt(hex.slice(1), 16);
    return {
      name,
      hex,
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  });

  // Offscreen canvas for browser color parsing fallback
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  // DOM Elements
  const els = {
    omniInput: document.getElementById("omniInput"),
    nativeColorInput: document.getElementById("nativeColorInput"),
    omniColorIndicator: document.getElementById("omniColorIndicator"),
    formatBadge: document.getElementById("formatBadge"),
    inputErrorNotice: document.getElementById("inputErrorNotice"),
    toastContainer: document.getElementById("toastContainer"),

    // Preview Elements
    previewSwatch: document.getElementById("previewSwatch"),
    previewName: document.getElementById("previewName"),
    previewHex: document.getElementById("previewHex"),
    previewRgb: document.getElementById("previewRgb"),

    // Format inputs
    fmtHex: document.getElementById("fmtHex"),
    fmtHex8: document.getElementById("fmtHex8"),
    fmtRgb: document.getElementById("fmtRgb"),
    fmtRgbModern: document.getElementById("fmtRgbModern"),
    fmtHsl: document.getElementById("fmtHsl"),
    fmtHsv: document.getElementById("fmtHsv"),
    fmtCmyk: document.getElementById("fmtCmyk"),
    fmtOklch: document.getElementById("fmtOklch"),
    fmtLab: document.getElementById("fmtLab"),
    fmtTailwind: document.getElementById("fmtTailwind"),
    fmtCssVar: document.getElementById("fmtCssVar"),
    fmtFlutter: document.getElementById("fmtFlutter"),
    fmtSwift: document.getElementById("fmtSwift"),
    fmtAndroid: document.getElementById("fmtAndroid"),
    fmtFloatRgb: document.getElementById("fmtFloatRgb"),
    fmtDecimal: document.getElementById("fmtDecimal"),
  };

  // Math & Formatting Utilities
  function clamp(val, min = 0, max = 255) {
    return Math.max(min, Math.min(max, val));
  }

  function round(val, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round(val * factor) / factor;
  }

  function toHex(n) {
    return clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  }

  // Color Conversions
  function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function rgbaToHex8(r, g, b, a) {
    const alphaHex = toHex(Math.round(clamp(a, 0, 1) * 255));
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  function hslToRgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    s = clamp(s, 0, 100) / 100;
    l = clamp(l, 0, 100) / 100;

    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
  }

  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max === min) {
      h = 0;
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  }

  function rgbToCmyk(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const k = 1 - Math.max(red, green, blue);
    if (k >= 0.9999) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((1 - red - k) / (1 - k)) * 100),
      m: Math.round(((1 - green - k) / (1 - k)) * 100),
      y: Math.round(((1 - blue - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  }

  function srgbToLinear(c) {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function rgbToOklch(r, g, b) {
    const lr = srgbToLinear(r);
    const lg = srgbToLinear(g);
    const lb = srgbToLinear(b);

    const l = Math.cbrt(
      0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
    );
    const m = Math.cbrt(
      0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
    );
    const s = Math.cbrt(
      0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
    );

    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const ob = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

    const C = Math.sqrt(a * a + ob * ob);
    let H = (Math.atan2(ob, a) * 180) / Math.PI;
    if (H < 0) H += 360;

    return { L: round(L, 3), C: round(C, 3), H: round(H, 1) };
  }

  function rgbToLab(r, g, b) {
    const lr = srgbToLinear(r);
    const lg = srgbToLinear(g);
    const lb = srgbToLinear(b);

    const x = (lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375) * 100;
    const y = (lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175) * 100;
    const z = (lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041) * 100;

    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const L = 116 * f(y / 100.0) - 16;
    const a = 500 * (f(x / 95.047) - f(y / 100.0));
    const ob = 200 * (f(y / 100.0) - f(z / 108.883));

    return { L: round(L, 1), a: round(a, 1), b: round(ob, 1) };
  }

  function getNearestColorName(r, g, b) {
    const hex = rgbToHex(r, g, b);
    if (HEX_TO_NAME[hex]) return HEX_TO_NAME[hex];

    let minDistance = Infinity;
    let closestName = "teal";
    for (const item of CSS_COLOR_ENTRIES) {
      const rmean = (r + item.r) / 2;
      const dr = r - item.r;
      const dg = g - item.g;
      const db = b - item.b;
      const dist = Math.sqrt(
        (2 + rmean / 256) * dr * dr +
          4 * dg * dg +
          (2 + (255 - rmean) / 256) * db * db,
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestName = item.name;
      }
    }
    return closestName;
  }

  // Universal Color Parser
  function parseColor(input) {
    if (!input || typeof input !== "string") return null;
    const str = input.trim().toLowerCase();

    // 1. Direct CSS Named Color
    if (CSS_COLORS[str]) {
      const hex = CSS_COLORS[str];
      const num = parseInt(hex.slice(1), 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
        a: 1.0,
        format: "CSS Name",
      };
    }

    // 2. Hex
    const cleanHex = str.startsWith("#") ? str.slice(1) : str;
    if (/^[0-9a-f]{3,8}$/i.test(cleanHex)) {
      if (cleanHex.length === 3) {
        return {
          r: parseInt(cleanHex[0] + cleanHex[0], 16),
          g: parseInt(cleanHex[1] + cleanHex[1], 16),
          b: parseInt(cleanHex[2] + cleanHex[2], 16),
          a: 1.0,
          format: "HEX",
        };
      }
      if (cleanHex.length === 4) {
        return {
          r: parseInt(cleanHex[0] + cleanHex[0], 16),
          g: parseInt(cleanHex[1] + cleanHex[1], 16),
          b: parseInt(cleanHex[2] + cleanHex[2], 16),
          a: round(parseInt(cleanHex[3] + cleanHex[3], 16) / 255, 2),
          format: "HEX8",
        };
      }
      if (cleanHex.length === 6) {
        return {
          r: parseInt(cleanHex.slice(0, 2), 16),
          g: parseInt(cleanHex.slice(2, 4), 16),
          b: parseInt(cleanHex.slice(4, 6), 16),
          a: 1.0,
          format: "HEX",
        };
      }
      if (cleanHex.length === 8) {
        return {
          r: parseInt(cleanHex.slice(0, 2), 16),
          g: parseInt(cleanHex.slice(2, 4), 16),
          b: parseInt(cleanHex.slice(4, 6), 16),
          a: round(parseInt(cleanHex.slice(6, 8), 16) / 255, 2),
          format: "HEX8",
        };
      }
    }

    // 3. Hex 0x prefix
    if (/^0x[0-9a-f]{6,8}$/i.test(str)) {
      const hexPart = str.slice(2);
      if (hexPart.length === 6) {
        return {
          r: parseInt(hexPart.slice(0, 2), 16),
          g: parseInt(hexPart.slice(2, 4), 16),
          b: parseInt(hexPart.slice(4, 6), 16),
          a: 1.0,
          format: "HEX",
        };
      }
      if (hexPart.length === 8) {
        return {
          a: round(parseInt(hexPart.slice(0, 2), 16) / 255, 2),
          r: parseInt(hexPart.slice(2, 4), 16),
          g: parseInt(hexPart.slice(4, 6), 16),
          b: parseInt(hexPart.slice(6, 8), 16),
          format: "ARGB",
        };
      }
    }

    // 4. Flutter Color(0xAARRGGBB)
    const flutterMatch = str.match(/color\s*\(\s*0x([0-9a-f]{8})\s*\)/i);
    if (flutterMatch) {
      const val = flutterMatch[1];
      const a = round(parseInt(val.slice(0, 2), 16) / 255, 2);
      const r = parseInt(val.slice(2, 4), 16);
      const g = parseInt(val.slice(4, 6), 16);
      const b = parseInt(val.slice(6, 8), 16);
      return { r, g, b, a, format: "Flutter" };
    }

    // CSS Custom Property (e.g. --color-primary: #14b8a6;)
    if (str.startsWith("--") && str.includes(":")) {
      const val = str
        .slice(str.indexOf(":") + 1)
        .replace(/;/g, "")
        .trim();
      if (val) return parseColor(val);
    }

    // Tailwind arbitrary syntax (e.g. bg-[#14b8a6] or [#14b8a6])
    const twMatch = str.match(/\[(#[0-9a-f]{3,8}|[a-z]+)\]/i);
    if (twMatch) {
      return parseColor(twMatch[1]);
    }

    // Swift / SwiftUI Color(red: 0.08, green: 0.72, blue: 0.65)
    const swiftMatch = str.match(
      /color\s*\(\s*red:\s*([\d.]+)\s*,\s*green:\s*([\d.]+)\s*,\s*blue:\s*([\d.]+)(?:\s*,\s*opacity:\s*([\d.]+))?\s*\)/i,
    );
    if (swiftMatch) {
      const r = clamp(Math.round(parseFloat(swiftMatch[1]) * 255));
      const g = clamp(Math.round(parseFloat(swiftMatch[2]) * 255));
      const b = clamp(Math.round(parseFloat(swiftMatch[3]) * 255));
      const a = swiftMatch[4] ? clamp(parseFloat(swiftMatch[4]), 0, 1) : 1.0;
      return { r, g, b, a: round(a, 2), format: "Swift" };
    }

    // Float RGB (e.g. vec4(0.078, 0.722, 0.651, 1.0))
    const vecMatch = str.match(
      /vec[34]\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
    );
    if (vecMatch) {
      const r = clamp(Math.round(parseFloat(vecMatch[1]) * 255));
      const g = clamp(Math.round(parseFloat(vecMatch[2]) * 255));
      const b = clamp(Math.round(parseFloat(vecMatch[3]) * 255));
      const a = vecMatch[4] ? clamp(parseFloat(vecMatch[4]), 0, 1) : 1.0;
      return { r, g, b, a: round(a, 2), format: "Float RGB" };
    }

    // 5. RGB / RGBA (both comma & slash syntax)
    const rgbRegex =
      /^rgba?\s*\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i;
    const rgbMatch = str.match(rgbRegex);
    if (rgbMatch) {
      const parseVal = (v) =>
        v.endsWith("%") ? (parseFloat(v) / 100) * 255 : parseFloat(v);
      const parseAlpha = (v) =>
        !v ? 1.0 : v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v);
      const r = clamp(Math.round(parseVal(rgbMatch[1])));
      const g = clamp(Math.round(parseVal(rgbMatch[2])));
      const b = clamp(Math.round(parseVal(rgbMatch[3])));
      const a = clamp(parseAlpha(rgbMatch[4]), 0, 1);
      return { r, g, b, a: round(a, 2), format: a < 1 ? "RGBA" : "RGB" };
    }

    // 6. HSL / HSLA
    const hslRegex =
      /^hsla?\s*\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i;
    const hslMatch = str.match(hslRegex);
    if (hslMatch) {
      const h = parseFloat(hslMatch[1]);
      const s = parseFloat(hslMatch[2]);
      const l = parseFloat(hslMatch[3]);
      let a = 1.0;
      if (hslMatch[4]) {
        a = hslMatch[4].endsWith("%")
          ? parseFloat(hslMatch[4]) / 100
          : parseFloat(hslMatch[4]);
      }
      const rgb = hslToRgb(h, s, l);
      return {
        ...rgb,
        a: round(clamp(a, 0, 1), 2),
        format: a < 1 ? "HSLA" : "HSL",
      };
    }

    // 7. HSV / HSB
    const hsvRegex =
      /^hs[vb]\s*\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%\s*\)$/i;
    const hsvMatch = str.match(hsvRegex);
    if (hsvMatch) {
      const h = parseFloat(hsvMatch[1]);
      const s = parseFloat(hsvMatch[2]);
      const v = parseFloat(hsvMatch[3]);
      const max = (v / 100) * 255;
      const min = max * (1 - s / 100);
      const h60 = h / 60;
      let r = 0,
        g = 0,
        b = 0;
      const i = Math.floor(h60) % 6;
      const f = h60 - Math.floor(h60);
      const q = max * (1 - (s / 100) * f);
      const t = max * (1 - (s / 100) * (1 - f));
      if (i === 0) {
        r = max;
        g = t;
        b = min;
      } else if (i === 1) {
        r = q;
        g = max;
        b = min;
      } else if (i === 2) {
        r = min;
        g = max;
        b = t;
      } else if (i === 3) {
        r = min;
        g = q;
        b = max;
      } else if (i === 4) {
        r = t;
        g = min;
        b = max;
      } else if (i === 5) {
        r = max;
        g = min;
        b = q;
      }
      return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b),
        a: 1.0,
        format: "HSV",
      };
    }

    // 8. CMYK
    const cmykRegex =
      /^cmyk\s*\(\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%\s*\)$/i;
    const cmykMatch = str.match(cmykRegex);
    if (cmykMatch) {
      const c = clamp(parseFloat(cmykMatch[1]), 0, 100) / 100;
      const m = clamp(parseFloat(cmykMatch[2]), 0, 100) / 100;
      const y = clamp(parseFloat(cmykMatch[3]), 0, 100) / 100;
      const k = clamp(parseFloat(cmykMatch[4]), 0, 100) / 100;
      return {
        r: Math.round(255 * (1 - c) * (1 - k)),
        g: Math.round(255 * (1 - m) * (1 - k)),
        b: Math.round(255 * (1 - y) * (1 - k)),
        a: 1.0,
        format: "CMYK",
      };
    }

    // 9. Decimal integer
    if (/^\d{5,10}$/.test(str)) {
      const num = parseInt(str, 10);
      if (num <= 0xffffffff) {
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255,
          a: 1.0,
          format: "Decimal",
        };
      }
    }

    // 10. Canvas fallback for OKLCH, LAB, etc.
    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#00000000";
      ctx.fillStyle = str;
      if (ctx.fillStyle !== "" && ctx.fillStyle !== "#00000000") {
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        let format = "CSS";
        if (str.startsWith("oklch")) format = "OKLCH";
        else if (str.startsWith("lab")) format = "LAB";
        return {
          r: data[0],
          g: data[1],
          b: data[2],
          a: round(data[3] / 255, 2),
          format,
        };
      }
    } catch {
      // ignore
    }

    return null;
  }

  // Toast notification
  function showToast(message) {
    if (!els.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✓</span><span>${message}</span>`;
    els.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // Copy helper
  async function copyText(text, label = "") {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${label}`);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast(`Copied ${label}`);
    }
  }

  // Main Translate & Render
  function translateColor(color, source = "input") {
    const { r, g, b, a } = color;
    const hex = rgbToHex(r, g, b);
    const hex8 = rgbaToHex8(r, g, b, a);
    const hsl = rgbToHsl(r, g, b);
    const hsv = rgbToHsv(r, g, b);
    const cmyk = rgbToCmyk(r, g, b);
    const oklch = rgbToOklch(r, g, b);
    const lab = rgbToLab(r, g, b);
    const nearestName = getNearestColorName(r, g, b);
    const alphaPercent = Math.round(a * 100);

    // Sync input controls
    if (source !== "input") {
      els.omniInput.value = a < 1 ? hex8 : hex;
    }
    els.nativeColorInput.value = hex;
    els.omniColorIndicator.style.backgroundColor = hex;
    els.inputErrorNotice.classList.add("hidden");
    els.formatBadge.textContent = color.format || (a < 1 ? "HEX8" : "HEX");

    // Live Color Preview
    const rgbaCss = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : hex;
    if (els.previewSwatch) {
      els.previewSwatch.style.backgroundColor = rgbaCss;
    }
    if (els.previewName) {
      els.previewName.textContent =
        nearestName.charAt(0).toUpperCase() + nearestName.slice(1);
    }
    if (els.previewHex) {
      els.previewHex.textContent = a < 1 ? hex8 : hex;
    }
    if (els.previewRgb) {
      els.previewRgb.textContent =
        a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    }

    // Output Formats
    els.fmtHex.value = hex;
    els.fmtHex8.value = hex8;
    els.fmtRgb.value =
      a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    els.fmtRgbModern.value = `rgb(${r} ${g} ${b} / ${alphaPercent}%)`;
    els.fmtHsl.value =
      a < 1
        ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})`
        : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    els.fmtHsv.value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
    els.fmtCmyk.value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    els.fmtOklch.value = `oklch(${oklch.L} ${oklch.C} ${oklch.H})`;
    els.fmtLab.value = `lab(${lab.L}% ${lab.a} ${lab.b})`;
    els.fmtTailwind.value = `bg-[${hex}] text-[${hex}]`;
    els.fmtCssVar.value = `--color-primary: ${hex};`;

    const hexPlain = hex.slice(1).toUpperCase();
    const alphaHexUpper = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
    els.fmtFlutter.value = `Color(0x${alphaHexUpper}${hexPlain})`;
    els.fmtSwift.value = `Color(red: ${(r / 255).toFixed(2)}, green: ${(g / 255).toFixed(2)}, blue: ${(b / 255).toFixed(2)})`;
    els.fmtAndroid.value = `#${alphaHexUpper}${hexPlain}`;
    els.fmtFloatRgb.value = `vec4(${(r / 255).toFixed(3)}, ${(g / 255).toFixed(3)}, ${(b / 255).toFixed(3)}, ${a.toFixed(1)})`;
    els.fmtDecimal.value = ((r << 16) + (g << 8) + b).toString();
  }

  // Event Listeners
  function setupEvents() {
    // 1. Omnibar universal input (instant translation)
    els.omniInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (!val) return;
      const parsed = parseColor(val);
      if (parsed) {
        translateColor(parsed, "input");
      } else {
        els.inputErrorNotice.classList.remove("hidden");
        els.formatBadge.textContent = "Invalid";
      }
    });

    els.omniInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        els.omniInput.blur();
      }
    });

    // 2. Native Color Picker
    els.nativeColorInput.addEventListener("input", (e) => {
      const parsed = parseColor(e.target.value);
      if (parsed) {
        translateColor(parsed, "picker");
      }
    });

    // 3. Format Cards: Click copy and inline edit
    document.querySelectorAll(".format-card").forEach((card) => {
      const input = card.querySelector(".format-input");
      const btn = card.querySelector(".copy-btn");
      const tag = card.querySelector(".format-tag")?.textContent || "Color";

      const handleCopy = () => {
        if (!input) return;
        copyText(input.value, tag);
        if (btn) {
          btn.classList.add("copied");
          btn.textContent = "✓ Copied";
          setTimeout(() => {
            btn.classList.remove("copied");
            btn.textContent = "📋 Copy";
          }, 1500);
        }
      };

      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          handleCopy();
        });
      }

      if (input) {
        input.addEventListener("focus", () => {
          input.select();
        });

        const handleFormatTranslate = () => {
          const val = input.value.trim();
          if (!val) return;
          const parsed = parseColor(val);
          if (parsed) {
            translateColor(parsed, "formatInput");
            showToast(`Translated from ${tag}`);
          } else {
            showToast(`Unable to parse ${tag}`);
          }
        };

        // When pressing Enter, translate to all formats
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleFormatTranslate();
            input.blur();
          }
        });

        // Also translate when change event fires
        input.addEventListener("change", () => {
          handleFormatTranslate();
        });
      }
    });
  }

  // Bootstrap
  function init() {
    setupEvents();
    const defaultColor = parseColor("#14b8a6");
    if (defaultColor) translateColor(defaultColor, "init");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
