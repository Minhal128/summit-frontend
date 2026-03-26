const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/*.{ts,tsx}');

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let orig = c;

  // Fix the layout globals problem
  c = c.replace(/import ["']@\/app\\globals\.css["'];/g, "import '@/app/globals.css';");

  // Fix mismatched quotes from my dynamic imports attempt
  c = c.replace(/await import\('@\/lib(.*?)"\)/g, "await import('@/lib$1')");
  c = c.replace(/await import\('@\/components(.*?)"\)/g, "await import('@/components$1')");

  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Fixed quotes / globals in', f);
  }
});
