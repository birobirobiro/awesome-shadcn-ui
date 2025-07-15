const fs = require('fs');

const path = 'README.md';
let content;
try {
  content = fs.readFileSync(path, 'utf8');
} catch (error) {
  console.error(`Error reading README.md: ${error.message}`);
  process.exit(1);
}

const lines = content.split('\n');
const updatedLines = [];
let changesCount = 0;

console.log(`Processing README.md with ${lines.length} lines`);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if this line has the pattern "| date |  2025-07-15  |"
  if (line.includes('|  2025-07-15  |')) {
    // Remove the extra "|  2025-07-15  |" part
    const cleanedLine = line.replace(/\|\s*2025-07-15\s*\|$/, '|');
    updatedLines.push(cleanedLine);
    changesCount++;
    console.log(`Cleaned line ${i + 1}: ${line.trim()} -> ${cleanedLine.trim()}`);
  } else if (line.includes('|  2025-07-15')) {
    // Handle case where it's at the end without trailing |
    const cleanedLine = line.replace(/\|\s*2025-07-15\s*$/, '');
    updatedLines.push(cleanedLine);
    changesCount++;
    console.log(`Cleaned line ${i + 1}: ${line.trim()} -> ${cleanedLine.trim()}`);
  } else {
    updatedLines.push(line);
  }
}

// Log summary
console.log(`Completed processing. Made ${changesCount} changes to remove duplicate dates.`);

if (changesCount > 0) {
  try {
    fs.writeFileSync(path, updatedLines.join('\n'));
    console.log('Changes written to README.md');
  } catch (error) {
    console.error(`Error writing to README.md: ${error.message}`);
    process.exit(1);
  }
} else {
  console.log('No changes needed, file not modified');
} 