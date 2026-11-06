# Color Translator 🎨

A fast, lightweight, zero-dependency universal color converter for web developers, mobile engineers, and UI designers. Input any color code in any format, get instant translations across 16 formats with 1-click clipboard copy.

![Accent Color](https://img.shields.io/badge/Accent-%2314b8a6-14b8a6)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen)
![Build Size](https://img.shields.io/badge/Bundle_Size-~31KB-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Universal Omnibar**: Type, paste, or pick any color format. The app automatically detects syntax and translates across all formats in real time.
- **16 Supported Formats**: Covers modern web, legacy web, mobile frameworks (Flutter, Swift, Android), graphics shaders, and print.
- **Bidirectional Editing**: Edit any individual format card and press **Enter** (or blur) to translate across all other formats.
- **Live Preview Swatch**:
  - Live color display with transparency checkerboard background.
  - Text contrast chips (`White text Aa` and `Black text Aa`) to quickly test legibility.
  - Closest CSS color name detector with delta-E approximation.
- **Flat & Clean Aesthetic**: Flat UI design styled with `#14b8a6` (Teal), with zero shadows and fast rendering.
- **Offline & Self-Contained**: Pure vanilla JavaScript, CSS, and HTML5 without any node modules or heavy bundlers.
- **Production Minifier**: Built-in Python 3 and Node.js build scripts to minify HTML, CSS, and JS into `dist/`.
- **Vercel Ready**: Preconfigured with `vercel.json` for one-click static site deployment with immutable caching.

---

## 📋 Supported Formats

| Format               | Example Output                              | Description                             |
| :------------------- | :------------------------------------------ | :-------------------------------------- |
| **HEX**              | `#14b8a6`                                   | Standard 6-digit hexadecimal            |
| **HEX Alpha**        | `#14b8a6ff`                                 | 8-digit hexadecimal with opacity        |
| **RGB / RGBA**       | `rgb(20, 184, 166)`                         | Standard CSS RGB / RGBA                 |
| **CSS RGB (Modern)** | `rgb(20 184 166 / 100%)`                    | CSS Color Level 4 space/slash syntax    |
| **HSL / HSLA**       | `hsl(173, 80%, 40%)`                        | Hue, Saturation, Lightness              |
| **HSV / HSB**        | `hsv(173, 89%, 72%)`                        | Hue, Saturation, Value (Design tools)   |
| **CMYK**             | `cmyk(89%, 0%, 10%, 28%)`                   | Cyan, Magenta, Yellow, Key (Print)      |
| **OKLCH**            | `oklch(0.7 0.14 182)`                       | Modern perceptually uniform color space |
| **CIELAB**           | `lab(67.4% -41.2 -1.4)`                     | CIE L\*a\*b\* device-independent color  |
| **Tailwind CSS**     | `bg-[#14b8a6] text-[#14b8a6]`               | Arbitrary value utility classes         |
| **CSS Variable**     | `--color-primary: #14b8a6;`                 | Ready-to-paste custom property          |
| **Flutter / Dart**   | `Color(0xFF14B8A6)`                         | Flutter `Color(0xAARRGGBB)` class       |
| **Swift / SwiftUI**  | `Color(red: 0.08, green: 0.72, blue: 0.65)` | SwiftUI `Color` initializer             |
| **Android XML**      | `#FF14B8A6`                                 | Android ARGB color hex code             |
| **Float RGB (vec4)** | `vec4(0.078, 0.722, 0.651, 1.0)`            | GLSL / Metal / WGSL shader vector       |
| **Decimal**          | `1358006`                                   | Base-10 integer representation          |

---

## 🚀 Getting Started

### 1. Run Locally (Development)

No installation required! Simply open `index.html` in your browser:

```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

Or serve with any static web server:

```bash
# Using Python
python -m http.server 3000

# Using npx
npx serve .
```

---

## 🛠️ Build & Minify

Both **Node.js** and **Python** build scripts are included. They strip whitespace, comments, compact rules, and link minified assets inside `dist/`.

### Using Node.js:

```bash
npm run build
# or
node build.js
```

### Using Python:

```bash
python build.py
```

### Output:

```text
dist/
├── index.html       (~7 KB, links minified assets)
├── style.min.css    (~6.7 KB)
└── app.min.js       (~17.8 KB)
```

---

## ☁️ Deployment

### Deploying to Vercel

The project includes a production-ready [`vercel.json`](file:///d:/Repo/color/vercel.json) configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "node build.js",
  "outputDirectory": "dist",
  "cleanUrls": true
}
```

#### Via Vercel CLI:

```bash
vercel
```

#### Via GitHub:

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the repository in your [Vercel Dashboard](https://vercel.com/dashboard).
3. Vercel automatically detects `vercel.json`, executes `node build.js`, and serves the optimized `dist/` directory.

---

## 📁 Project Structure

```text
.
├── dist/               # Minified production build (generated)
├── app.js              # Core color algorithms & DOM logic
├── build.js            # Node.js production minifier
├── build.py            # Python 3 production minifier
├── index.html          # Main HTML structure
├── package.json        # NPM scripts & metadata
├── style.css           # Flat styling & responsive grid layout
├── vercel.json         # Vercel deployment configuration
└── README.md           # Documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
