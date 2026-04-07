const fs = require('fs');
const path = require('path');

// Create required directories for Expo project
const dirs = [
  'app',
  'src/components/ui',
  'src/lib',
  'assets'
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log('✅ Created:', dir);
});

console.log('\n📁 Directory structure ready!');
console.log('Run this script with: node backup.js');
