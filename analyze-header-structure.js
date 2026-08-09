#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── Get __dirname equivalent in ES modules ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuration ──────────────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname); // Use current directory
const SRC_DIR = path.join(PROJECT_ROOT, "src");
const COMPONENTS_DIR = path.join(SRC_DIR, "components");

console.log(`🔍 Project Root: ${PROJECT_ROOT}`);
console.log(`🔍 SRC Directory: ${SRC_DIR}`);
console.log(`🔍 Components Directory: ${COMPONENTS_DIR}\n`);

// ── Color helpers ──────────────────────────────────────────────────────
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
};

// ── Helper Functions ──────────────────────────────────────────────────

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log("\n" + "═".repeat(80));
  log(colors.bright + colors.cyan, `  ${title}`);
  console.log("═".repeat(80));
}

function logSubSection(title) {
  console.log("\n" + "─".repeat(60));
  log(colors.bright + colors.yellow, `  ${title}`);
  console.log("─".repeat(60));
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return null;
  }
}

function findFiles(dir, pattern, results = []) {
  try {
    if (!fs.existsSync(dir)) {
      return results;
    }
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findFiles(filePath, pattern, results);
      } else if (pattern.test(file)) {
        results.push(filePath);
      }
    }
  } catch (e) {
    // Ignore permission errors
  }
  return results;
}

function extractImports(content) {
  const imports = [];
  const importRegex =
    /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function extractComponentNames(content) {
  const components = [];
  // Look for component exports
  const exportRegex =
    /export\s+(?:default\s+)?(?:function|const|class)\s+(\w+)/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    components.push(match[1]);
  }
  return components;
}

function extractMediaQueries(content) {
  const breakpoints = [];
  const mqRegex = /@media\s*(?:screen\s*and\s*)?\(([^)]+)\)/g;
  let match;
  while ((match = mqRegex.exec(content)) !== null) {
    breakpoints.push(match[1]);
  }
  return breakpoints;
}

function findStickyRules(content) {
  const rules = [];
  const stickyRegex = /position\s*:\s*sticky/g;
  const fixedRegex = /position\s*:\s*fixed/g;
  let match;
  while ((match = stickyRegex.exec(content)) !== null) {
    rules.push({ type: "sticky", index: match.index });
  }
  while ((match = fixedRegex.exec(content)) !== null) {
    rules.push({ type: "fixed", index: match.index });
  }
  return rules;
}

// ── Analysis Functions ─────────────────────────────────────────────────

function analyzeHeaderComponents() {
  logSection("HEADER COMPONENT ANALYSIS");

  // Find all header-related files
  const headerFiles = findFiles(
    COMPONENTS_DIR,
    /(Header|header|Nav|nav|Fixed|fixed)\.(jsx|js|tsx|ts)$/,
  );

  if (headerFiles.length === 0) {
    log(
      colors.yellow,
      "  ⚠️ No header-related files found. Searching entire src directory...",
    );
    // Try searching from src instead
    const allFiles = findFiles(
      SRC_DIR,
      /(Header|header|Nav|nav|Fixed|fixed|MainHeader|SubHeader)\.(jsx|js|tsx|ts)$/,
    );
    if (allFiles.length > 0) {
      log(
        colors.green,
        `  ✅ Found ${allFiles.length} files in src directory:`,
      );
      allFiles.forEach((file) => {
        const relativePath = path.relative(PROJECT_ROOT, file);
        const content = readFileContent(file);
        const components = content ? extractComponentNames(content) : [];
        log(colors.green, `  📄 ${relativePath}`);
        if (components.length) {
          log(colors.dim, `     Exports: ${components.join(", ")}`);
        }
      });
      return allFiles;
    }
    log(colors.red, "  ❌ No header files found anywhere.");
    return [];
  }

  log(colors.bright, `Found ${headerFiles.length} header-related files:`);
  headerFiles.forEach((file) => {
    const relativePath = path.relative(PROJECT_ROOT, file);
    const content = readFileContent(file);
    const components = content ? extractComponentNames(content) : [];
    log(colors.green, `  📄 ${relativePath}`);
    if (components.length) {
      log(colors.dim, `     Exports: ${components.join(", ")}`);
    }
  });

  return headerFiles;
}

function analyzeMainHeader() {
  logSubSection("MainHeader.jsx Analysis");

  const mainHeaderPaths = [
    path.join(COMPONENTS_DIR, "MainHeader.jsx"),
    path.join(SRC_DIR, "MainHeader.jsx"),
    path.join(PROJECT_ROOT, "MainHeader.jsx"),
  ];

  let content = null;
  let foundPath = null;

  for (const p of mainHeaderPaths) {
    content = readFileContent(p);
    if (content) {
      foundPath = p;
      break;
    }
  }

  if (!content) {
    log(
      colors.red,
      "  ❌ MainHeader.jsx not found. Looking for any MainHeader file...",
    );
    const allFiles = findFiles(SRC_DIR, /MainHeader\.(jsx|js|tsx|ts)$/);
    if (allFiles.length > 0) {
      log(
        colors.green,
        `  ✅ Found at: ${path.relative(PROJECT_ROOT, allFiles[0])}`,
      );
      content = readFileContent(allFiles[0]);
      foundPath = allFiles[0];
    } else {
      log(colors.yellow, "  ⚠️ MainHeader.jsx not found. Skipping analysis.");
      return;
    }
  }

  log(
    colors.green,
    `  ✅ MainHeader.jsx found at ${path.relative(PROJECT_ROOT, foundPath)}`,
  );

  // Extract imports
  const imports = extractImports(content);
  log(colors.cyan, `\n  Imports:`);
  imports.forEach((imp) => {
    log(colors.dim, `    • ${imp}`);
  });

  // Extract the component structure
  const sections = [];
  const sectionRegex = /{\/\*[\s-]*([^*]+)[\s-]*\*\/}/g;
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push(match[1].trim());
  }

  if (sections.length) {
    log(colors.yellow, `\n  Sections in MainHeader:`);
    sections.forEach((section, i) => {
      const icon = section.includes("Desktop")
        ? "🖥️"
        : section.includes("Mobile")
          ? "📱"
          : "📄";
      log(colors.cyan, `    ${icon} ${section}`);
    });
  }

  // Extract component usage
  const componentRegex = /<(\w+)\s*\/?>/g;
  let compMatch;
  const usedComponents = [];
  const exclude = [
    "div",
    "section",
    "main",
    "article",
    "header",
    "footer",
    "nav",
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "span",
    "a",
    "button",
    "img",
    "ul",
    "li",
    "i",
    "Fragment",
  ];
  while ((compMatch = componentRegex.exec(content)) !== null) {
    if (!exclude.includes(compMatch[1])) {
      usedComponents.push(compMatch[1]);
    }
  }

  if (usedComponents.length) {
    const uniqueComponents = [...new Set(usedComponents)];
    log(colors.magenta, `\n  Components used:`);
    uniqueComponents.forEach((comp) => {
      log(colors.dim, `    • ${comp}`);
    });
  }

  // Check for sticky positioning
  const hasSticky = content.includes("sticky");
  const hasFixed = content.includes("fixed");
  if (hasSticky || hasFixed) {
    log(
      colors.green,
      `\n  ✅ Contains ${hasSticky ? "sticky" : ""}${hasSticky && hasFixed ? " and " : ""}${hasFixed ? "fixed" : ""} positioning`,
    );
  } else {
    log(
      colors.yellow,
      `\n  ⚠️ No sticky or fixed positioning found in MainHeader.jsx`,
    );
  }
}

function analyzeSubHeader() {
  logSubSection("SubHeader.jsx Analysis");

  const subHeaderPaths = [
    path.join(COMPONENTS_DIR, "SubHeader.jsx"),
    path.join(SRC_DIR, "SubHeader.jsx"),
    path.join(PROJECT_ROOT, "SubHeader.jsx"),
  ];

  let content = null;
  let foundPath = null;

  for (const p of subHeaderPaths) {
    content = readFileContent(p);
    if (content) {
      foundPath = p;
      break;
    }
  }

  if (!content) {
    log(
      colors.red,
      "  ❌ SubHeader.jsx not found. Looking for any SubHeader file...",
    );
    const allFiles = findFiles(SRC_DIR, /SubHeader\.(jsx|js|tsx|ts)$/);
    if (allFiles.length > 0) {
      log(
        colors.green,
        `  ✅ Found at: ${path.relative(PROJECT_ROOT, allFiles[0])}`,
      );
      content = readFileContent(allFiles[0]);
      foundPath = allFiles[0];
    } else {
      log(colors.yellow, "  ⚠️ SubHeader.jsx not found. Skipping analysis.");
      return;
    }
  }

  log(
    colors.green,
    `  ✅ SubHeader.jsx found at ${path.relative(PROJECT_ROOT, foundPath)}`,
  );

  // Find responsive sections
  const mediaQueries = extractMediaQueries(content);
  if (mediaQueries.length) {
    log(colors.cyan, `\n  Media Queries found:`);
    mediaQueries.forEach((mq) => {
      const breakpoint = mq.match(/(min|max)-width:\s*(\d+px)/);
      if (breakpoint) {
        const type = breakpoint[1] === "min" ? "📈 Min" : "📉 Max";
        log(colors.dim, `    ${type}-width: ${breakpoint[2]}`);
      } else {
        log(colors.dim, `    • ${mq}`);
      }
    });
  }

  // Check for sticky positioning
  const hasSticky = content.includes("sticky");
  const hasFixed = content.includes("fixed");
  if (hasSticky || hasFixed) {
    log(
      colors.green,
      `\n  ✅ Contains ${hasSticky ? "sticky" : ""}${hasSticky && hasFixed ? " and " : ""}${hasFixed ? "fixed" : ""} positioning`,
    );
  } else {
    log(
      colors.yellow,
      `\n  ⚠️ No sticky or fixed positioning found in SubHeader.jsx`,
    );
  }
}

function analyzeCSSStructure() {
  logSubSection("CSS Structure Analysis");

  const cssFiles = findFiles(SRC_DIR, /\.module\.css$/);
  const headerCSS = cssFiles.filter(
    (f) => f.includes("Header") || f.includes("header") || f.includes("Nav"),
  );

  if (headerCSS.length === 0) {
    log(colors.yellow, "  ⚠️ No header-related CSS files found.");
    return;
  }

  log(colors.cyan, `Found ${headerCSS.length} header-related CSS files:`);

  headerCSS.forEach((file) => {
    const relativePath = path.relative(PROJECT_ROOT, file);
    const content = readFileContent(file);

    if (content) {
      // Extract key classes
      const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)\s*\{/g;
      const classes = [];
      let match;
      while ((match = classRegex.exec(content)) !== null) {
        classes.push(match[1]);
      }

      // Extract media queries
      const mqs = extractMediaQueries(content);

      log(colors.green, `\n  📄 ${relativePath}`);
      log(
        colors.dim,
        `     ${classes.length} CSS classes, ${mqs.length} media queries`,
      );

      // Check for sticky
      if (content.includes("sticky")) {
        log(colors.green, `     ✅ Contains sticky positioning`);
      }

      if (classes.length > 5) {
        log(
          colors.dim,
          `     Classes: ${classes.slice(0, 5).join(", ")}${classes.length > 5 ? ` ... and ${classes.length - 5} more` : ""}`,
        );
      }

      if (mqs.length) {
        log(
          colors.dim,
          `     Breakpoints: ${mqs.map((m) => m.match(/\d+px/)?.[0] || m).join(", ")}`,
        );
      }
    }
  });
}

function checkGlobalCSS() {
  logSubSection("Global CSS Check");

  const globalPaths = [
    path.join(SRC_DIR, "index.css"),
    path.join(SRC_DIR, "App.css"),
    path.join(SRC_DIR, "styles", "global.css"),
    path.join(PROJECT_ROOT, "src", "index.css"),
    path.join(PROJECT_ROOT, "src", "App.css"),
  ];

  let found = false;
  globalPaths.forEach((file) => {
    if (fs.existsSync(file)) {
      found = true;
      const content = readFileContent(file);
      if (content) {
        const hasSticky = content.includes("sticky");
        const hasZIndex = content.includes("z-index");
        const hasOverflow = content.includes("overflow");

        log(colors.green, `  ✅ ${path.relative(PROJECT_ROOT, file)}`);
        log(
          colors.dim,
          `     sticky: ${hasSticky ? "✅" : "❌"}, z-index: ${hasZIndex ? "✅" : "❌"}, overflow: ${hasOverflow ? "✅" : "❌"}`,
        );
      }
    }
  });

  if (!found) {
    log(colors.yellow, "  ⚠️ No global CSS files found.");
  }
}

function generateRecommendations() {
  logSection("RECOMMENDATIONS");

  console.log(`
  ${colors.bright}${colors.yellow}Desktop Header Sticky Issues - Recommendations:${colors.reset}

  1. ${colors.cyan}Check parent containers:${colors.reset}
     - Ensure no parent has ${colors.yellow}overflow: hidden${colors.reset}
     - Ensure no parent has ${colors.yellow}position: relative${colors.reset} interfering
     - The sticky element must be a direct child of the body or a container with no overflow

  2. ${colors.cyan}Z-index hierarchy:${colors.reset}
     - Desktop header: ${colors.green}z-index: 9999${colors.reset}
     - Mobile header: ${colors.green}z-index: 9999${colors.reset}
     - Other content: ${colors.green}z-index: 1-100${colors.reset}

  3. ${colors.cyan}Common fix:${colors.reset}
     \`\`\`css
     .desktopHeader {
       position: sticky !important;
       top: 0 !important;
       z-index: 9999 !important;
       background: #ffffff !important;
       transform: translateZ(0);
       -webkit-transform: translateZ(0);
       will-change: transform;
     }
     \`\`\`

  4. ${colors.cyan}Check browser:${colors.reset}
     - Safari requires ${colors.yellow}-webkit-sticky${colors.reset}
     - Edge/Chrome/Firefox support sticky natively

  5. ${colors.cyan}Debug tip:${colors.reset}
     - Add a ${colors.yellow}border${colors.reset} or ${colors.yellow}background${colors.reset} to see if it's sticking but invisible
     - Check if it's being pushed down by another element
  `);
}

// ── Main Execution ─────────────────────────────────────────────────────

function main() {
  console.log(
    colors.bright + colors.magenta,
    "\n╔═══════════════════════════════════════════════════════════════════════╗",
  );
  console.log(
    colors.bright + colors.magenta,
    "║           WEBSITE HEADER STRUCTURE ANALYZER                        ║",
  );
  console.log(
    colors.bright + colors.magenta,
    "╚═══════════════════════════════════════════════════════════════════════╝",
  );

  console.log(colors.dim, `\nProject root: ${PROJECT_ROOT}`);
  console.log(colors.dim, `Components directory: ${COMPONENTS_DIR}`);

  // Run all analyses
  analyzeHeaderComponents();
  analyzeMainHeader();
  analyzeSubHeader();
  analyzeCSSStructure();
  checkGlobalCSS();
  generateRecommendations();

  console.log(colors.dim, "\n" + "─".repeat(80));
  console.log(colors.dim, `Analysis complete. ${colors.green}✅`);
  console.log(colors.dim, "─".repeat(80) + "\n");
}

// ── Run the script ─────────────────────────────────────────────────────

main();

export { analyzeHeaderComponents, analyzeMainHeader, analyzeSubHeader };
