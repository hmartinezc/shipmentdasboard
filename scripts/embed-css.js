/*
  Post-build step to embed dist-razor/liquidation-styles.css into
  dist-razor/liquidation-bundle.js as a global string used by the
  Web Component to inject styles into its Shadow DOM.
*/

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist-razor');
const jsPath = join(distDir, 'liquidation-bundle.js');
const cssPath = join(distDir, 'liquidation-styles.css');

if (!existsSync(jsPath)) {
  console.error('[embed-css] JS bundle not found:', jsPath);
  process.exit(1);
}

if (!existsSync(cssPath)) {
  console.warn('[embed-css] CSS file not found, nothing to embed:', cssPath);
  process.exit(0);
}

const cssRaw = readFileSync(cssPath, 'utf8');
// Escape backticks and \u2028/\u2029 to be safe in template literal
const cssEscaped = cssRaw
  .replace(/`/g, '\\`')
  .replace(/\\/g, '\\\\')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029');

const jsRaw = readFileSync(jsPath, 'utf8');
const banner = `/* Embedded CSS */\n;(function(){\n  try {\n    window.__LIQUIDATION_STYLES__ = \`${cssEscaped}\`;\n  } catch (e) { /* no-op */ }\n})();\n`;

writeFileSync(jsPath, banner + jsRaw, 'utf8');

// Optional: remove CSS file so the final artifact is a single .js
try {
  unlinkSync(cssPath);
  console.log('[embed-css] Embedded CSS and removed file:', cssPath);
} catch (e) {
  console.warn('[embed-css] Embedded CSS but could not remove file:', e.message);
}

console.log('[embed-css] Done. Single-file JS ready:', jsPath);
