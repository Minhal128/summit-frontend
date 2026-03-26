// file: H:\Development\crypto\summit-frontend\scripts\extract-and-wrap.ts
import { Project, SyntaxKind, JsxText, JsxExpression, StringLiteral } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

// This script safely finds raw hardcoded text strings in React components
// and saves them to a structured dictionary file to be later used by translations.
const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const srcDir = path.join(__dirname, '../src');
project.addSourceFilesAtPaths(`${srcDir}/**/*.tsx`);

const dictionary: Record<string, string> = {};

function processFile(file: any) {
  let needsImport = false;
  let hasChanges = false;
  
  // Find JSX Elements (the visual UI parts)
  file.forEachDescendant((node: any) => {
    // Look for plain JSX Text: <div>Hello</div>
    if (node.getKind() === SyntaxKind.JsxText) {
      const text = node.getText().trim();
      // Skip empty strings, purely whitespace, or single characters/punctuation
      if (text.length > 1 && /[a-zA-Z]/.test(text) && !text.includes('{') && !text.includes('}')) {
        const key = text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 30);
        const finalKey = `text_${key}`;
        
        dictionary[finalKey] = text;
        // In a true transformation script, we would do:
        // node.replaceWithText(`{t('${finalKey}')}`);
        // hasChanges = true;
      }
    }

    // Look for String Literals inside JSX attributes (like placeholders or titles)
    if (node.getKind() === SyntaxKind.StringLiteral) {
      const parent = node.getParent();
      if (parent && parent.getKind() === SyntaxKind.JsxAttribute) {
        const attrName = parent.getNameNode().getText();
        // Specifically target display text attributes
        if (['placeholder', 'title', 'label', 'aria-label', 'alt'].includes(attrName)) {
           const text = node.getLiteralValue();
           if (text && text.length > 1 && /[a-zA-Z]/.test(text)) {
              const key = `attr_${attrName}_${text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 20)}`;
              dictionary[key] = text;
              // node.replaceWithText(`{t('${key}')}`);
              // hasChanges = true;
           }
        }
      }
    }
  });

  return hasChanges;
}

const sourceFiles = project.getSourceFiles();
console.log(`Starting scan of ${sourceFiles.length} files...`);

let processedCount = 0;
for (const file of sourceFiles) {
  processFile(file);
  processedCount++;
}

console.log(`Scan complete. Found ${Object.keys(dictionary).length} strings.`);

// Write the dictionary to en.json
const dictPath = path.join(__dirname, '../messages/en.json');
fs.writeFileSync(dictPath, JSON.stringify(dictionary, null, 2));
console.log(`✅ Base English dictionary written to: ${dictPath}`);
