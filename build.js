const fs = require("fs");
const path = require("path");

function minifyCss(css) {
  // 1. Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");

  // 2. Tokenize strings to preserve them
  const strings = [];
  css = css.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, (m) => {
    strings.push(m);
    return `___CSS_STR_${strings.length - 1}___`;
  });

  // 3. Collapse whitespace and newlines
  css = css.replace(/\s+/g, " ");
  css = css.replace(/\s*([\{\}\:\;\,\>\+\~\(\)])\s*/g, "$1");
  css = css.replace(/;\}/g, "}");

  // 4. Restore strings
  strings.forEach((s, i) => {
    css = css.replace(`___CSS_STR_${i}___`, s);
  });

  return css.trim();
}

function minifyJs(code) {
  const tokens = [];
  let i = 0;
  const n = code.length;
  let lastSig = "";

  while (i < n) {
    const ch = code[i];

    // Single-line comment
    if (ch === "/" && i + 1 < n && code[i + 1] === "/") {
      i += 2;
      while (i < n && code[i] !== "\r" && code[i] !== "\n") i++;
      continue;
    }

    // Multi-line comment
    if (ch === "/" && i + 1 < n && code[i + 1] === "*") {
      i += 2;
      while (i + 1 < n && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    // Single quote string
    if (ch === "'") {
      const start = i++;
      while (i < n) {
        if (code[i] === "\\") i += 2;
        else if (code[i] === "'") {
          i++;
          break;
        } else i++;
      }
      tokens.push(["STR", code.slice(start, i)]);
      lastSig = "'";
      continue;
    }

    // Double quote string
    if (ch === '"') {
      const start = i++;
      while (i < n) {
        if (code[i] === "\\") i += 2;
        else if (code[i] === '"') {
          i++;
          break;
        } else i++;
      }
      tokens.push(["STR", code.slice(start, i)]);
      lastSig = '"';
      continue;
    }

    // Template literal
    if (ch === "`") {
      const start = i++;
      while (i < n) {
        if (code[i] === "\\") i += 2;
        else if (code[i] === "`") {
          i++;
          break;
        } else i++;
      }
      tokens.push(["STR", code.slice(start, i)]);
      lastSig = "`";
      continue;
    }

    // Regex literal vs division
    if (ch === "/") {
      let isRegex = [
        "",
        "(",
        "[",
        "{",
        "=",
        ":",
        ",",
        ";",
        "!",
        "&",
        "|",
        "?",
        "+",
        "-",
        "*",
        "%",
        "<",
        ">",
        "~",
        "^",
      ].includes(lastSig);
      if (!isRegex && tokens.length) {
        for (let j = tokens.length - 1; j >= 0; j--) {
          if (tokens[j][0] !== "WS") {
            if (
              [
                "return",
                "case",
                "typeof",
                "delete",
                "throw",
                "void",
                "instanceof",
                "in",
                "yield",
                "await",
              ].includes(tokens[j][1])
            ) {
              isRegex = true;
            }
            break;
          }
        }
      }

      if (isRegex) {
        const start = i++;
        let inClass = false;
        while (i < n) {
          if (code[i] === "\\") i += 2;
          else if (code[i] === "[") {
            inClass = true;
            i++;
          } else if (code[i] === "]" && inClass) {
            inClass = false;
            i++;
          } else if (code[i] === "/" && !inClass) {
            i++;
            while (i < n && /[a-z]/i.test(code[i])) i++;
            break;
          } else i++;
        }
        tokens.push(["REGEX", code.slice(start, i)]);
        lastSig = "/";
        continue;
      }
    }

    // Whitespace
    if (/\s/.test(ch)) {
      tokens.push(["WS", " "]);
      i++;
      continue;
    }

    // Word token
    if (/[a-zA-Z0-9_$]/.test(ch)) {
      const start = i;
      while (i < n && /[a-zA-Z0-9_$.]/.test(code[i])) i++;
      const word = code.slice(start, i);
      tokens.push(["WORD", word]);
      lastSig = word.slice(-1);
      continue;
    }

    // Punctuation
    tokens.push(["PUNCT", ch]);
    lastSig = ch;
    i++;
  }

  const out = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const [kind, val] = tokens[idx];
    if (kind === "WS") {
      const prevTok = out.length ? out[out.length - 1] : "";
      let nextVal = "";
      for (let j = idx + 1; j < tokens.length; j++) {
        if (tokens[j][0] !== "WS") {
          nextVal = tokens[j][1];
          break;
        }
      }

      if (
        prevTok &&
        /[a-zA-Z0-9_$]/.test(prevTok.slice(-1)) &&
        nextVal &&
        /[a-zA-Z0-9_$]/.test(nextVal[0])
      ) {
        out.push(" ");
      } else if (
        prevTok &&
        prevTok.endsWith("+") &&
        nextVal &&
        nextVal.startsWith("+")
      ) {
        out.push(" ");
      } else if (
        prevTok &&
        prevTok.endsWith("-") &&
        nextVal &&
        nextVal.startsWith("-")
      ) {
        out.push(" ");
      }
      continue;
    }
    out.push(val);
  }

  return out.join("");
}

function minifyHtml(html) {
  html = html.replace(/href=["']style\.css["']/g, 'href="style.min.css"');
  html = html.replace(/src=["']app\.js["']/g, 'src="app.min.js"');
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");
  html = html.replace(/>\s+</g, "><");
  html = html.replace(/\s+/g, " ");
  return html.trim();
}

function formatBytes(bytes) {
  return bytes >= 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`;
}

function build() {
  const root = __dirname;
  const dist = path.join(root, "dist");
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

  const startTime = Date.now();
  console.log("=".repeat(60));
  console.log(" 🛠️  COLOR TRANSLATOR - PRODUCTION BUILD (Node.js)");
  console.log("=".repeat(60));

  const origCss = fs.readFileSync(path.join(root, "style.css"), "utf-8");
  const minCss = minifyCss(origCss);
  fs.writeFileSync(path.join(dist, "style.min.css"), minCss, "utf-8");
  fs.writeFileSync(path.join(root, "style.min.css"), minCss, "utf-8");

  const origJs = fs.readFileSync(path.join(root, "app.js"), "utf-8");
  const minJs = minifyJs(origJs);
  fs.writeFileSync(path.join(dist, "app.min.js"), minJs, "utf-8");
  fs.writeFileSync(path.join(root, "app.min.js"), minJs, "utf-8");

  const origHtml = fs.readFileSync(path.join(root, "index.html"), "utf-8");
  const minHtml = minifyHtml(origHtml);
  fs.writeFileSync(path.join(dist, "index.html"), minHtml, "utf-8");

  const files = [
    ["style.css -> style.min.css", origCss.length, minCss.length],
    ["app.js   -> app.min.js", origJs.length, minJs.length],
    ["index.html (dist)", origHtml.length, minHtml.length],
  ];

  const totalOrig = files.reduce((acc, f) => acc + f[1], 0);
  const totalMin = files.reduce((acc, f) => acc + f[2], 0);
  const elapsed = Date.now() - startTime;

  console.log(
    `\n${"Asset".padEnd(30)} | ${"Original".padEnd(10)} | ${"Minified".padEnd(10)} | ${"Savings".padEnd(10)}`,
  );
  console.log("-".repeat(68));
  for (const [name, oSize, mSize] of files) {
    const savings = (1 - mSize / oSize) * 100;
    console.log(
      `${name.padEnd(30)} | ${formatBytes(oSize).padEnd(10)} | ${formatBytes(mSize).padEnd(10)} | -${savings.toFixed(1)}%`,
    );
  }
  const totalSavings = (1 - totalMin / totalOrig) * 100;
  console.log("-".repeat(68));
  console.log(
    `${"Total Bundle Size".padEnd(30)} | ${formatBytes(totalOrig).padEnd(10)} | ${formatBytes(totalMin).padEnd(10)} | -${totalSavings.toFixed(1)}%`,
  );
  console.log("=".repeat(68));
  console.log(`✅ Build finished successfully in ${elapsed}ms!`);
  console.log(`📁 Output directory: ${dist}`);
  console.log("=".repeat(68) + "\n");
}

build();
