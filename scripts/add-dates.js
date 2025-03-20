const fs = require('fs');

const path = 'README.md';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

let inTable = false;
const currentDate = new Date().toISOString().split('T')[0]; // e.g., 2023-10-15
const updatedLines = [];

for (const line of lines) {
  if (line.startsWith('## ')) {
    inTable = false; // Reset when hitting a new section
  }
  if (line.startsWith('|')) {
    inTable = true;
    const parts = line.split('|').map(part => part.trim());
    // Check for data rows (not header or separator)
    if (parts.length === 4 && !parts[1].startsWith('-') && parts[1] !== 'Name') {
      // Row has 3 columns (excluding empty parts at ends), append date
      updatedLines.push(line + ` ${currentDate} |`);
    } else {
      updatedLines.push(line); // Leave headers, separators, or 4-column rows unchanged
    }
  } else {
    inTable = false;
    updatedLines.push(line);
  }
}

fs.writeFileSync(path, updatedLines.join('\n'));
