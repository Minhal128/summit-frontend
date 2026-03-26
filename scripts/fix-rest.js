const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/app/**/*.{ts,tsx}');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let orig = c;
  
  c = c.replace(/@\/appacademyacademy\.css/g, './academy.css');
  c = c.replace(/from '\.\.\/\.\.\/components/g, "from '@/components");
  c = c.replace(/from '\.\.\/\.\.\/contexts/g, "from '@/contexts");
  c = c.replace(/from '\.\.\/\.\.\/lib/g, "from '@/lib");
  c = c.replace(/from '\.\.\/\.\.\/utils/g, "from '@/utils");
  c = c.replace(/from '\.\.\/\.\.\/hooks/g, "from '@/hooks");
  
  c = c.replace(/from "\.\.\/\.\.\/components/g, 'from "@/components');
  c = c.replace(/from "\.\.\/\.\.\/contexts/g, 'from "@/contexts');
  c = c.replace(/from "\.\.\/\.\.\/lib/g, 'from "@/lib');
  c = c.replace(/from "\.\.\/\.\.\/utils/g, 'from "@/utils');
  c = c.replace(/from "\.\.\/\.\.\/hooks/g, 'from "@/hooks');
  
  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Fixed ', f);
  }
});
