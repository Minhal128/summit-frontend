const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/*.{ts,tsx}');

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let orig = c;

  // fix the css import
  c = c.replace(/import ['"]@\/app[\\\/]academy[\\\/]academy\.css['"];/g, "import './academy.css';");
  c = c.replace(/import ['"]\.\.\/\.\.\/academy\.css['"];/g, "import './academy.css';");

  // fix dynamic imports
  c = c.replace(/await import\(['"]\.\.\/\.\.\/lib/g, "await import('@/lib");
  c = c.replace(/await import\(['"]\.\.\/\.\.\/components/g, "await import('@/components");

  // generic static imports across the board
  c = c.replace(/from ['"]\.\.\/\.\.\/components/g, "from '@/components");
  c = c.replace(/from ['"]\.\.\/\.\.\/lib/g, "from '@/lib");

  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Fixed', f);
  }
});
