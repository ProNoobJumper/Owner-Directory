const fs = require('fs');
const { marked } = require('marked');
const path = require('path');

const mdPath = path.join(
    'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\e1f04a0d-3825-4690-9352-96f78ddf9f7f',
    'deep_dive_analysis.md'
);
const outPath = path.join('C:\\Users\\DELL\\Downloads\\Owner Directory Website', 'deep_dive_analysis.html');

const md = fs.readFileSync(mdPath, 'utf-8');

marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true
});

const body = marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Dive Technical Analysis — Owner Directory Website</title>
<style>
/* ===== RESET & BASE ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  line-height: 1.7;
  color: #1a1a2e;
  background: #f8f9fc;
  padding: 0;
  margin: 0;
}

.wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 48px;
  background: #fff;
  min-height: 100vh;
}

/* ===== HEADINGS ===== */
h1 {
  font-size: 2.2em;
  font-weight: 800;
  color: #0f0f3d;
  border-bottom: 4px solid #4361ee;
  padding-bottom: 14px;
  margin: 50px 0 24px 0;
  letter-spacing: -0.5px;
}

h1:first-child { margin-top: 0; }

h2 {
  font-size: 1.55em;
  font-weight: 700;
  color: #16213e;
  margin: 40px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

h3 {
  font-size: 1.25em;
  font-weight: 700;
  color: #1a1a2e;
  margin: 30px 0 12px 0;
}

h4 {
  font-size: 1.08em;
  font-weight: 700;
  color: #2d3748;
  margin: 22px 0 10px 0;
}

/* ===== PARAGRAPHS & TEXT ===== */
p {
  margin: 10px 0;
  color: #2d3748;
}

strong { color: #1a1a2e; }

em { color: #4a5568; }

/* ===== LINKS ===== */
a { color: #4361ee; text-decoration: none; }
a:hover { text-decoration: underline; }

/* ===== HORIZONTAL RULES ===== */
hr {
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 28px 0;
}

hr + hr {
  height: 3px;
  background: linear-gradient(90deg, #4361ee, #7209b7);
  margin: 36px 0;
  border-radius: 2px;
}

/* ===== CODE ===== */
code {
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.88em;
  background: #f1f5f9;
  color: #c7254e;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

pre {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 20px 24px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 16px 0;
  border: 1px solid #313244;
  line-height: 1.55;
}

pre code {
  background: none;
  color: inherit;
  padding: 0;
  border: none;
  font-size: 0.85em;
}

/* ===== TABLES ===== */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 0.92em;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

thead {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: #fff;
}

thead th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tbody tr { border-bottom: 1px solid #f1f5f9; }
tbody tr:nth-child(even) { background: #f8fafc; }
tbody tr:hover { background: #eef2ff; }

td {
  padding: 10px 16px;
  color: #334155;
  vertical-align: top;
}

td code {
  font-size: 0.85em;
  background: #eef2ff;
  color: #3730a3;
  border-color: #c7d2fe;
}

/* ===== BLOCKQUOTES (Callouts) ===== */
blockquote {
  margin: 18px 0;
  padding: 16px 20px;
  border-left: 4px solid #4361ee;
  background: #eef2ff;
  border-radius: 0 8px 8px 0;
  color: #1e3a5f;
}

blockquote p { margin: 4px 0; color: #1e3a5f; }

blockquote strong { color: #1e40af; }

/* Security deep dive callouts */
blockquote:has(strong:first-child) {
  border-left-color: #dc2626;
  background: #fef2f2;
}

/* ===== LISTS ===== */
ul, ol {
  margin: 10px 0;
  padding-left: 28px;
}

li {
  margin: 5px 0;
  color: #334155;
}

li strong { color: #1a1a2e; }

/* ===== EMOJIS / ICONS sizing ===== */

/* ===== SPECIAL: Part Headers ===== */
h1:has(+ blockquote) {
  background: linear-gradient(135deg, #1e1e2e, #2d2d44);
  color: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  border-bottom: none;
  margin-top: 60px;
}

/* ===== PRINT STYLES ===== */
@media print {
  body { background: #fff; font-size: 12px; }
  .wrapper { padding: 20px; max-width: 100%; }
  pre { background: #f5f5f5 !important; color: #333 !important; border: 1px solid #ddd; }
  pre code { color: #333 !important; }
  thead { background: #333 !important; }
  table { page-break-inside: avoid; }
  h1, h2, h3 { page-break-after: avoid; }
  blockquote { page-break-inside: avoid; }
}

/* ===== PAGE BREAKS for PDF ===== */
h1 { page-break-before: always; }
h1:first-child { page-break-before: avoid; }

/* ===== COMPLETION MARKERS ===== */
p:last-child {
  margin-bottom: 40px;
}
</style>
</head>
<body>
<div class="wrapper">
${body}
</div>
</body>
</html>`;

fs.writeFileSync(outPath, html, 'utf-8');
console.log('Done! Output:', outPath);
console.log('File size:', (fs.statSync(outPath).size / 1024).toFixed(0), 'KB');
