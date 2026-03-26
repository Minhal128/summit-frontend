const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/*.{ts,tsx}');

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let orig = c;

  // Fix escaped backslashes in imports that might cause issues.
  // Actually, we can use regex to replace \ with / inside import statements.
  c = c.replace(/(import .*? from ['"])(.*?)(['"];)/g, (match, p1, p2, p3) => {
    return p1 + p2.replace(/\\/g, '/') + p3;
  });

  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Fixed backslashes in', f);
  }
});
