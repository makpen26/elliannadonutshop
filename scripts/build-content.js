const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve(__dirname, '..', 'content');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'src', 'data', 'content.json');
const OUTPUT_DIR = path.dirname(OUTPUT_PATH);
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function readDir(dir) {
  const fullPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath)
    .filter(f => f.endsWith('.json'))
    .map(f => readJSON(path.join(fullPath, f)));
}

const site = readJSON(path.join(CONTENT_DIR, '_site.json'));
const home = readJSON(path.join(CONTENT_DIR, '_home.json'));
const aboutContent = readJSON(path.join(CONTENT_DIR, '_about.json'));
const contact = readJSON(path.join(CONTENT_DIR, '_contact.json'));
const dashboard = readJSON(path.join(CONTENT_DIR, '_dashboard.json'));

const categories = readDir('menu/categories');

const allItems = readDir('menu/items');

const menu = {
  categories: categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    items: allItems
      .filter(item => item.category === cat.id)
      .map(({ category, ...rest }) => rest),
  })),
};

const team = readDir('team');

const content = {
  site,
  home,
  menu,
  about: { ...aboutContent, team },
  contact,
  dashboard,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(content, null, 2) + '\n');
console.log('✓ content.json generated from individual content files');
