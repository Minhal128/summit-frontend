const fs = require("node:fs");
const path = require("node:path");
const { Project, Node } = require("ts-morph");
const { translate } = require("@vitalets/google-translate-api");

const ROOT = process.cwd();
const MESSAGES_DIR = path.join(ROOT, "messages");
const EN_PATH = path.join(MESSAGES_DIR, "en.json");
const TARGET_LOCALES = ["zh", "ar", "ru", "th", "es", "fr", "de"];

const TRANSLATABLE_JSX_ATTRS = new Set([
  "placeholder",
  "title",
  "label",
  "aria-label",
  "alt",
  "helperText",
  "caption",
]);

const TRANSLATABLE_OBJECT_PROPS = new Set([
  "title",
  "description",
  "question",
  "answer",
  "label",
  "text",
  "placeholder",
  "alt",
  "heading",
  "subheading",
  "cta",
  "buttonText",
  "name",
  "message",
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readArg(name, defaultValue) {
  const raw = process.argv.find((a) => a.startsWith(`${name}=`));
  if (!raw) return defaultValue;
  const value = Number(raw.split("=")[1]);
  return Number.isFinite(value) ? value : defaultValue;
}

function normalizeText(input) {
  return input.replace(/\s+/g, " ").replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

function isLikelyTranslatable(text) {
  const t = normalizeText(text);

  if (!t || t.length < 2) return false;
  if (/^[-–—_=+*/\\|<>~`]+$/.test(t)) return false;
  if (/^(https?:\/\/|www\.|mailto:|tel:)/i.test(t)) return false;
  if (/^(\/|\.\/|\.\.\/|[A-Za-z]:\\)/.test(t)) return false;
  if (/\.(png|jpe?g|svg|gif|webp|json|css|ts|tsx|js|jsx)$/i.test(t)) return false;
  if (/^#[0-9a-f]{3,8}$/i.test(t)) return false;
  if (/^(bg-|text-|border-|px-|py-|mx-|my-|flex|grid|w-|h-|rounded|shadow)/.test(t)) return false;
  if (/^\{.*\}$/.test(t)) return false;
  if (/^[0-9.,:%$€£¥-]+$/.test(t)) return false;

  const hasLetterLike = /[A-Za-z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u4E00-\u9FFF]/.test(t);
  if (!hasLetterLike) return false;

  return true;
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeJsonSorted(filePath, data) {
  const sortedKeys = Object.keys(data).sort((a, b) => a.localeCompare(b));
  const sorted = {};
  for (const key of sortedKeys) sorted[key] = data[key];
  fs.writeFileSync(filePath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
}

function slugify(value) {
  const s = normalizeText(value)
    .toLowerCase()
    .replace(/&apos;|&quot;|&amp;|&#39;|&#34;/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return s.slice(0, 48) || "value";
}

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function makeUniqueKey(text, dict, usedKeys) {
  const base = `text_${slugify(text)}`;
  if (!usedKeys.has(base) && dict[base] === undefined) return base;

  const withHash = `${base}_${hashString(text).slice(0, 6)}`;
  if (!usedKeys.has(withHash) && dict[withHash] === undefined) return withHash;

  let i = 2;
  while (true) {
    const candidate = `${withHash}_${i}`;
    if (!usedKeys.has(candidate) && dict[candidate] === undefined) return candidate;
    i += 1;
  }
}

function shouldExtractStringLiteral(node) {
  const parent = node.getParent();

  if (!parent) return false;

  if (
    Node.isImportDeclaration(parent) ||
    Node.isExportDeclaration(parent) ||
    Node.isImportEqualsDeclaration(parent)
  ) {
    return false;
  }

  if (Node.isJsxAttribute(parent)) {
    const attr = parent.getNameNode().getText();
    return TRANSLATABLE_JSX_ATTRS.has(attr);
  }

  if (Node.isPropertyAssignment(parent)) {
    const name = parent.getNameNode().getText().replace(/['"`]/g, "");
    return TRANSLATABLE_OBJECT_PROPS.has(name);
  }

  if (Node.isArrayLiteralExpression(parent)) {
    return true;
  }

  if (Node.isConditionalExpression(parent)) {
    return true;
  }

  return false;
}

async function translateWithRetry(text, locale) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await translate(text, { from: "en", to: locale });
      const translated = normalizeText(result.text || "");
      if (translated) return translated;
      return text;
    } catch (error) {
      lastError = error;
      await sleep(500 * attempt);
    }
  }

  console.warn(`[WARN] Translation failed after retries for locale=${locale}:`, lastError);
  return text;
}

async function translateBatchWithRetry(texts, locale) {
  if (!texts.length) return [];

  const marker = "<<<I18N_SPLIT_MARKER>>>";
  const payload = texts.map((t, i) => `__KEY_${i}__ ${t}`).join(` ${marker} `);

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await translate(payload, { from: "en", to: locale });
      const translatedText = normalizeText(result.text || "");
      if (!translatedText) return texts;

      const chunks = translatedText.split(marker);
      if (chunks.length !== texts.length) {
        throw new Error(`Batch split mismatch: expected ${texts.length}, got ${chunks.length}`);
      }

      return chunks.map((chunk, i) => {
        const cleaned = normalizeText(chunk.replace(new RegExp(`^\\s*__KEY_${i}__\\s*`), ""));
        return cleaned || texts[i];
      });
    } catch (error) {
      lastError = error;
      await sleep(700 * attempt);
    }
  }

  console.warn(`[WARN] Batch translation failed for locale=${locale}. Falling back to single-item translation.`, lastError);
  const fallback = [];
  for (const text of texts) {
    fallback.push(await translateWithRetry(text, locale));
  }
  return fallback;
}

async function main() {
  const args = process.argv.slice(2);
  const extractOnly = args.includes("--extract-only");
  const pagesOnly = args.includes("--pages-only");
  const fallbackToEnglish = args.includes("--fallback-to-en");
  const skipTranslate = args.includes("--skip-translate");
  const batchSize = Math.max(1, readArg("--batch-size", 20));
  const maxPerLocale = Math.max(0, readArg("--max-per-locale", 0));
  const delayMs = Math.max(0, readArg("--delay-ms", 100));

  const project = new Project({ tsConfigFilePath: path.join(ROOT, "tsconfig.json") });

  if (pagesOnly) {
    project.addSourceFilesAtPaths(path.join(ROOT, "src", "app", "[locale]", "**", "page.tsx"));
  } else {
    project.addSourceFilesAtPaths(path.join(ROOT, "src", "**", "*.ts"));
    project.addSourceFilesAtPaths(path.join(ROOT, "src", "**", "*.tsx"));
  }

  const sourceFiles = project
    .getSourceFiles()
    .filter((f) => !f.getFilePath().endsWith(".d.ts"));

  const en = safeReadJson(EN_PATH);
  const usedKeys = new Set(Object.keys(en));

  const valueToKey = new Map();
  for (const [key, value] of Object.entries(en)) {
    const normalized = normalizeText(value);
    if (normalized && !valueToKey.has(normalized)) {
      valueToKey.set(normalized, key);
    }
  }

  let scannedStrings = 0;
  let newlyAdded = 0;
  let pageRouteStrings = 0;

  for (const file of sourceFiles) {
    const filePath = file.getFilePath().replace(/\\/g, "/");
    const isPageRoute = /\/src\/app\/\[locale\]\/.+\/page\.tsx$/.test(filePath) || /\/src\/app\/\[locale\]\/page\.tsx$/.test(filePath);

    file.forEachDescendant((node) => {
      if (Node.isJsxText(node)) {
        const text = normalizeText(node.getText());
        if (!isLikelyTranslatable(text)) return;

        scannedStrings += 1;
        if (isPageRoute) pageRouteStrings += 1;

        if (!valueToKey.has(text)) {
          const key = makeUniqueKey(text, en, usedKeys);
          en[key] = text;
          usedKeys.add(key);
          valueToKey.set(text, key);
          newlyAdded += 1;
        }
      }

      if (Node.isStringLiteral(node) && shouldExtractStringLiteral(node)) {
        const text = normalizeText(node.getLiteralText());
        if (!isLikelyTranslatable(text)) return;

        scannedStrings += 1;
        if (isPageRoute) pageRouteStrings += 1;

        if (!valueToKey.has(text)) {
          const key = makeUniqueKey(text, en, usedKeys);
          en[key] = text;
          usedKeys.add(key);
          valueToKey.set(text, key);
          newlyAdded += 1;
        }
      }
    });
  }

  writeJsonSorted(EN_PATH, en);

  const localeAudit = {};

  for (const locale of TARGET_LOCALES) {
    const localePath = path.join(MESSAGES_DIR, `${locale}.json`);
    const localeDict = safeReadJson(localePath);

    const missingBefore = Object.keys(en).filter((key) => !localeDict[key] || !normalizeText(localeDict[key])).length;

    let translatedNow = 0;

    if (!extractOnly) {
      const missingKeys = Object.keys(en).filter((key) => !localeDict[key] || !normalizeText(localeDict[key]));
      const workKeys = maxPerLocale > 0 ? missingKeys.slice(0, maxPerLocale) : missingKeys;

      for (let i = 0; i < workKeys.length; i += batchSize) {
        const batchKeys = workKeys.slice(i, i + batchSize);
        const batchTexts = batchKeys.map((key) => en[key]);
        const translatedBatch = skipTranslate
          ? batchTexts
          : await translateBatchWithRetry(batchTexts, locale);

        batchKeys.forEach((key, index) => {
          const translated = translatedBatch[index];
          localeDict[key] = fallbackToEnglish ? translated || en[key] : translated || localeDict[key] || "";
          translatedNow += 1;
        });

        writeJsonSorted(localePath, localeDict);

        if (translatedNow % 100 === 0 || translatedNow === workKeys.length) {
          console.log(`[${locale}] translated ${translatedNow}/${workKeys.length}`);
        }

        if (delayMs > 0) {
          await sleep(delayMs);
        }
      }
    }

    writeJsonSorted(localePath, localeDict);

    const missingAfter = Object.keys(en).filter((key) => !localeDict[key] || !normalizeText(localeDict[key])).length;

    localeAudit[locale] = {
      beforeMissing: missingBefore,
      translatedNow,
      afterMissing: missingAfter,
    };
  }

  console.log("\n=== Deep i18n sync complete ===");
  console.log(`Mode: ${pagesOnly ? "pages-only" : "full-source"}${extractOnly ? " (extract-only)" : ""}`);
  console.log(`Translation batch size: ${batchSize}`);
  console.log(`Translation max-per-locale: ${maxPerLocale > 0 ? maxPerLocale : "all"}`);
  console.log(`Translation delay-ms: ${delayMs}`);
  console.log(`Translation skip-translate: ${skipTranslate}`);
  console.log(`Translation fallback-to-en: ${fallbackToEnglish}`);
  console.log(`Source files scanned: ${sourceFiles.length}`);
  console.log(`Translatable strings discovered: ${scannedStrings}`);
  console.log(`Route page.tsx strings discovered: ${pageRouteStrings}`);
  console.log(`New keys added to en.json: ${newlyAdded}`);
  console.log(`Total en.json keys: ${Object.keys(en).length}`);

  console.log("\n=== Locale audit ===");
  for (const locale of TARGET_LOCALES) {
    const row = localeAudit[locale];
    console.log(
      `${locale}: missing before=${row.beforeMissing}, translated now=${row.translatedNow}, missing after=${row.afterMissing}`,
    );
  }
}

main().catch((error) => {
  console.error("[deep-i18n-sync] failed:", error);
  process.exitCode = 1;
});
