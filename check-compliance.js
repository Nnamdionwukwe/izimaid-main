#!/usr/bin/env node

import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ──────────────────────────────────────────
const CONFIG = {
  // Files and directories to scan (relative to project root)
  scanPaths: [
    "src",
    "pages",
    "components",
    "routes",
    "public",
    "package.json",
    "README.md",
  ],
  // File extensions to inspect for text
  textExtensions: [".js", ".jsx", ".ts", ".tsx", ".html", ".json", ".md"],
  // Keywords to search for (case‑insensitive)
  keywords: {
    terms: ["terms of use", "terms of service", "terms and conditions", "tos"],
    privacy: ["privacy policy", "privacy notice", "data protection"],
    cookies: ["cookie", "cookies", "cookie consent", "cookie banner"],
    dataCollection: [
      "form",
      "input",
      "email",
      "phone",
      "address",
      "payment",
      "credit card",
      "analytics",
      "google analytics",
      "gtag",
      "facebook pixel",
      "hotjar",
    ],
    thirdParty: [
      "api",
      "axios",
      "fetch",
      "maps",
      "google maps",
      "mapbox",
      "social login",
      "facebook login",
      "google login",
      "oauth",
      "paystack",
      "flutterwave",
      "stripe",
      "paypal",
    ],
    consent: ["consent", "gdpr", "ccpa", "do not sell", "opt-out"],
  },
  // Important routes to check
  importantRoutes: ["/terms", "/privacy", "/cookie-policy"],
};

// ─── Main analysis ──────────────────────────────────────────
async function analyzeProject(rootDir) {
  const report = {
    projectName: "Unknown",
    version: "?",
    termsAndPrivacy: {
      hasTermsPage: false,
      hasPrivacyPage: false,
      hasCookiePolicy: false,
      termsMentioned: false,
      privacyMentioned: false,
      cookieMentioned: false,
    },
    dataCollection: {
      formsFound: false,
      analyticsFound: false,
      thirdPartyFound: false,
      socialLoginFound: false,
      paymentFound: false,
      cookiesMentioned: false,
      consentMechanismFound: false,
    },
    routes: [],
    findings: [],
    recommendations: [],
    warnings: [],
  };

  // Read package.json
  const pkgPath = path.join(rootDir, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkgContent = await fs.readFile(pkgPath, "utf8");
      const pkg = JSON.parse(pkgContent);
      report.projectName = pkg.name || "Unnamed";
      report.version = pkg.version || "?";
      // Check for common dependencies that imply data handling
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (
        deps["react-ga"] ||
        deps["react-ga4"] ||
        deps["gtag"] ||
        deps["@segment/analytics-next"]
      ) {
        report.dataCollection.analyticsFound = true;
      }
      if (
        deps["@paystack/inline-js"] ||
        deps["flutterwave"] ||
        deps["stripe"] ||
        deps["paypal"]
      ) {
        report.dataCollection.paymentFound = true;
      }
    } catch (e) {
      report.warnings.push("Could not parse package.json");
    }
  }

  // Scan files for textual evidence
  const allFiles = await walkDir(rootDir);
  const textFiles = allFiles.filter((f) =>
    CONFIG.textExtensions.includes(path.extname(f).toLowerCase()),
  );

  for (const file of textFiles) {
    let content = "";
    try {
      content = await fs.readFile(file, "utf8");
    } catch (e) {
      continue;
    }
    const lower = content.toLowerCase();

    // Detect route definitions (React Router)
    const routeMatches = lower.match(/<Route\s+path=["']([^"']*)["']/g) || [];
    for (const match of routeMatches) {
      const routePath = match.match(/["']([^"']*)["']/)[1];
      if (routePath && !report.routes.includes(routePath)) {
        report.routes.push(routePath);
      }
    }

    // Detect terms/privacy pages
    if (file.includes("terms") || file.includes("privacy")) {
      if (lower.includes("terms") || lower.includes("terms of use")) {
        report.termsAndPrivacy.hasTermsPage = true;
      }
      if (lower.includes("privacy") || lower.includes("privacy policy")) {
        report.termsAndPrivacy.hasPrivacyPage = true;
      }
      if (lower.includes("cookie") || lower.includes("cookies")) {
        report.termsAndPrivacy.hasCookiePolicy = true;
      }
    }

    // Search for keywords in content
    const termsFound = CONFIG.keywords.terms.some((k) => lower.includes(k));
    const privacyFound = CONFIG.keywords.privacy.some((k) => lower.includes(k));
    const cookieFound = CONFIG.keywords.cookies.some((k) => lower.includes(k));
    const dataCollFound = CONFIG.keywords.dataCollection.some((k) =>
      lower.includes(k),
    );
    const thirdPartyFound = CONFIG.keywords.thirdParty.some((k) =>
      lower.includes(k),
    );
    const consentFound = CONFIG.keywords.consent.some((k) => lower.includes(k));

    if (termsFound) report.termsAndPrivacy.termsMentioned = true;
    if (privacyFound) report.termsAndPrivacy.privacyMentioned = true;
    if (cookieFound) report.termsAndPrivacy.cookieMentioned = true;
    if (dataCollFound) report.dataCollection.formsFound = true;
    if (thirdPartyFound) {
      report.dataCollection.thirdPartyFound = true;
      if (
        lower.includes("social login") ||
        lower.includes("facebook login") ||
        lower.includes("google login")
      ) {
        report.dataCollection.socialLoginFound = true;
      }
      if (
        lower.includes("paystack") ||
        lower.includes("stripe") ||
        lower.includes("paypal")
      ) {
        report.dataCollection.paymentFound = true;
      }
    }
    if (consentFound) {
      report.dataCollection.consentMechanismFound = true;
    }
    // Additional check for cookie banner (common patterns)
    if (
      lower.includes("cookie-consent") ||
      lower.includes("cookieconsent") ||
      lower.includes("cookie banner")
    ) {
      report.dataCollection.consentMechanismFound = true;
    }
  }

  // Check if important routes exist
  const routesLower = report.routes.map((r) => r.toLowerCase());
  if (!routesLower.includes("/terms") && !routesLower.includes("terms")) {
    report.findings.push("No dedicated Terms of Use page found.");
  }
  if (!routesLower.includes("/privacy") && !routesLower.includes("privacy")) {
    report.findings.push("No dedicated Privacy Policy page found.");
  }
  if (
    !routesLower.includes("/cookie-policy") &&
    !routesLower.includes("cookie")
  ) {
    report.warnings.push(
      "No Cookie Policy route found. Consider adding one if you use cookies.",
    );
  }

  // Recommendations
  if (
    !report.termsAndPrivacy.hasTermsPage &&
    !report.termsAndPrivacy.termsMentioned
  ) {
    report.recommendations.push("Create and link a clear Terms of Use page.");
  } else if (!report.termsAndPrivacy.hasTermsPage) {
    report.recommendations.push(
      "Ensure Terms of Use page is accessible via a route.",
    );
  }
  if (
    !report.termsAndPrivacy.hasPrivacyPage &&
    !report.termsAndPrivacy.privacyMentioned
  ) {
    report.recommendations.push(
      "Create and link a comprehensive Privacy Policy page.",
    );
  } else if (!report.termsAndPrivacy.hasPrivacyPage) {
    report.recommendations.push(
      "Ensure Privacy Policy page is accessible via a route.",
    );
  }

  if (
    report.dataCollection.formsFound ||
    report.dataCollection.analyticsFound
  ) {
    if (!report.dataCollection.consentMechanismFound) {
      report.recommendations.push(
        "Add a cookie consent / data collection consent banner to comply with GDPR/CCPA.",
      );
    }
  }

  if (
    report.dataCollection.socialLoginFound ||
    report.dataCollection.paymentFound
  ) {
    report.recommendations.push(
      "Disclose third‑party data sharing (social logins, payment processors) in Privacy Policy.",
    );
  }

  if (
    report.routes.some(
      (r) => r.includes("api") || r.includes("submit") || r.includes("contact"),
    )
  ) {
    report.recommendations.push(
      "Ensure forms have a privacy notice and data handling disclosure.",
    );
  }

  // Final compliance check
  const criticalIssues = [];
  if (
    !report.termsAndPrivacy.hasTermsPage &&
    !report.termsAndPrivacy.termsMentioned
  ) {
    criticalIssues.push("Terms of Use missing");
  }
  if (
    !report.termsAndPrivacy.hasPrivacyPage &&
    !report.termsAndPrivacy.privacyMentioned
  ) {
    criticalIssues.push("Privacy Policy missing");
  }
  if (
    (report.dataCollection.formsFound ||
      report.dataCollection.analyticsFound) &&
    !report.dataCollection.consentMechanismFound
  ) {
    criticalIssues.push("No consent mechanism for data collection");
  }

  if (criticalIssues.length > 0) {
    report.recommendations.push(
      "❗ CRITICAL: Address the following before production: " +
        criticalIssues.join(", "),
    );
  }

  report.overallStatus =
    criticalIssues.length === 0
      ? "✅ Ready for production"
      : "⚠️ Needs attention";

  return report;
}

// ─── Utility: walk directory ─────────────────────────────────
async function walkDir(dir) {
  let results = [];
  try {
    const list = await fs.readdir(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      let st;
      try {
        st = await fs.stat(filePath);
      } catch (e) {
        continue;
      }
      if (st.isDirectory()) {
        // Skip node_modules, .git, etc.
        if (["node_modules", ".git", ".next", "build", "dist"].includes(file))
          continue;
        const sub = await walkDir(filePath);
        results = results.concat(sub);
      } else {
        results.push(filePath);
      }
    }
  } catch (e) {
    // Ignore permission errors
  }
  return results;
}

// ─── Run ─────────────────────────────────────────────────────
const targetDir = process.argv[2] || process.cwd();
console.log(`🔍 Scanning project: ${targetDir}\n`);

const report = await analyzeProject(targetDir);

// Pretty print report
console.log("📋 COMPLIANCE REPORT");
console.log("=".repeat(50));
console.log(`Project: ${report.projectName} v${report.version}`);
console.log(`Status: ${report.overallStatus}`);
console.log("\n📄 Terms & Privacy");
console.log(
  `  Terms page: ${report.termsAndPrivacy.hasTermsPage ? "✅" : "❌"}`,
);
console.log(
  `  Privacy page: ${report.termsAndPrivacy.hasPrivacyPage ? "✅" : "❌"}`,
);
console.log(
  `  Cookie policy: ${report.termsAndPrivacy.hasCookiePolicy ? "✅" : "❌"}`,
);
console.log(
  `  Terms mentioned in text: ${report.termsAndPrivacy.termsMentioned ? "✅" : "❌"}`,
);
console.log(
  `  Privacy mentioned: ${report.termsAndPrivacy.privacyMentioned ? "✅" : "❌"}`,
);
console.log(
  `  Cookie mentioned: ${report.termsAndPrivacy.cookieMentioned ? "✅" : "❌"}`,
);

console.log("\n📊 Data Collection");
console.log(`  Forms found: ${report.dataCollection.formsFound ? "⚠️" : "✅"}`);
console.log(
  `  Analytics found: ${report.dataCollection.analyticsFound ? "⚠️" : "✅"}`,
);
console.log(
  `  Third‑party services: ${report.dataCollection.thirdPartyFound ? "⚠️" : "✅"}`,
);
console.log(
  `  Social login: ${report.dataCollection.socialLoginFound ? "⚠️" : "✅"}`,
);
console.log(
  `  Payment processing: ${report.dataCollection.paymentFound ? "⚠️" : "✅"}`,
);
console.log(
  `  Consent mechanism: ${report.dataCollection.consentMechanismFound ? "✅" : "❌"}`,
);

console.log("\n🔗 Routes found:");
if (report.routes.length > 0) {
  report.routes.slice(0, 10).forEach((r) => console.log(`  - ${r}`));
  if (report.routes.length > 10)
    console.log(`  ... and ${report.routes.length - 10} more`);
} else {
  console.log("  No routes detected (maybe not using React Router?)");
}

if (report.findings.length > 0) {
  console.log("\n⚠️ Findings:");
  report.findings.forEach((f) => console.log(`  - ${f}`));
}

if (report.warnings.length > 0) {
  console.log("\n⚠️ Warnings:");
  report.warnings.forEach((w) => console.log(`  - ${w}`));
}

if (report.recommendations.length > 0) {
  console.log("\n💡 Recommendations:");
  report.recommendations.forEach((r) => console.log(`  - ${r}`));
}

// Save JSON report
const reportPath = path.join(targetDir, "compliance-report.json");
await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(`\n📄 Full report saved to ${reportPath}`);
