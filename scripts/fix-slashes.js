const {Project} = require('ts-morph');
const project = new Project();
project.addSourceFilesAtPaths('src/app/[locale]/**/*.{ts,tsx}');
for (const sourceFile of project.getSourceFiles()) {
  let changed = false;
  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDecl of importDeclarations) {
    const modSpecifier = importDecl.getModuleSpecifierValue();
    if (modSpecifier.startsWith('@/')) {
      const fixed = modSpecifier.replace(/\\\\/g, '/');
      if (fixed !== modSpecifier) {
        importDecl.setModuleSpecifier(fixed);
        changed = true;
      }
    }
  }
}
project.saveSync();
console.log('Fixed slashes!');
