import { Project } from 'ts-morph';
import * as path from 'path';

const project = new Project();
project.addSourceFilesAtPaths('src/app/[locale]/**/*.{ts,tsx}');

const srcDir = path.resolve('src').replace(/\\\\/g, '/').toLowerCase();

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  const oldDir = path.dirname(filePath).replace('/[locale]', '');
  
  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDecl of importDeclarations) {
    const modSpecifier = importDecl.getModuleSpecifierValue();
    if (modSpecifier.startsWith('.')) {
      const targetAbsPath = path.resolve(oldDir, modSpecifier).replace(/\\\\/g, '/');
      if (targetAbsPath.toLowerCase().startsWith(srcDir)) {
        const relativeToSrc = targetAbsPath.substring(srcDir.length + 1);
        const newAlias = '@/' + relativeToSrc;
        importDecl.setModuleSpecifier(newAlias);
      }
    }
  }
}
project.saveSync();
console.log('Fixed imports case insensitively!');
