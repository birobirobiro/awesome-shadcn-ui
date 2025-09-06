const fs = require('fs');
const path = 'README.md';

let content;
try {
  content = fs.readFileSync(path, 'utf8');
} catch (err) {
  console.error(`Error reading README.md: ${err.message}`);
  process.exit(1);
}

// Split the content into lines
const lines = content.split('\n');
const updatedLines = [];

let inTable = false;

for (let line of lines) {
  if (line.startsWith('|')) {
    inTable = true;

    // Remove internal line breaks and extra spaces in cells
    const parts = line.split('|').map(cell => cell.replace(/\n/g, ' ').trim());

    // Rebuild the line with pipes, keeping one line per entry
    const formattedLine = '| ' + parts.filter((_, i) => i !== 0 && i !== parts.length - 1 || parts[i] !== '').join(' | ') + ' |';

    updatedLines.push(formattedLine);
  } else {
    if (inTable) {
      inTable = false;
    }
    updatedLines.push(line);
  }
}

// Overwrite README.md with the updated lines
try {
  fs.writeFileSync(path, updatedLines.join('\n'));
  console.log('README.md formatted successfully!');
} catch (err) {
  console.error(`Error writing README.md: ${err.message}`);
  process.exit(1);
}