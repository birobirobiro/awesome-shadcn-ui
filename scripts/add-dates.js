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

const currentDate = new Date().toISOString(); // e.g., 2026-04-24T18:30:00.000Z
const updatedLines = [];
let changesCount = 0;

console.log(`Processing README.md with ${lines.length} lines`);

// Accepts YYYY-MM-DD or any ISO 8601 timestamp parseable by Date (e.g. with
// Z suffix or timezone offset like -03:00). Both formats coexist so we don't
// clobber legacy day-only dates or backfilled timestamps from git history.
function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

let inTable = false;
let tableHasDateColumn = false;
let headerLineCount = 0;
let dateColumnIndex = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Reset table state when hitting a new section
  if (line.startsWith('## ')) {
    inTable = false;
    tableHasDateColumn = false;
    headerLineCount = 0;
    dateColumnIndex = -1;
  }

  if (line.startsWith('|')) {
    if (!inTable) {
      // First line of a new table (header)
      inTable = true;
      headerLineCount = 1;

      // Check if the table header has a date column and find its index
      const parts = line.split('|').map(part => part.trim());
      dateColumnIndex = parts.findIndex(part => part === 'Date');
      tableHasDateColumn = dateColumnIndex > -1;
      updatedLines.push(line);
      continue;
    } else {
      headerLineCount++;
    }

    // Skip header and separator rows
    if (headerLineCount <= 2) {
      updatedLines.push(line);
      continue;
    }

    // Process data rows
    if (tableHasDateColumn && dateColumnIndex > 0) {
      // Split the line into parts, preserving the original structure
      const parts = line.split('|');
      
      // Ensure we have enough parts for the date column
      while (parts.length <= dateColumnIndex + 1) {
        parts.push('');
      }
      
      // Get the current date value (trimmed)
      const currentDateValue = parts[dateColumnIndex].trim();
      
      // Only add date if it's empty, whitespace, or invalid
      if (!currentDateValue || currentDateValue === '' || !isValidDate(currentDateValue)) {
        parts[dateColumnIndex] = ` ${currentDate} `;
        changesCount++;
      }
      
      // Reconstruct the line
      const newLine = parts.join('|');
      updatedLines.push(newLine);
    } else {
      // No date column or invalid structure, keep as is
      updatedLines.push(line);
    }
  } else {
    // Not a table row
    updatedLines.push(line);
  }
}

// Log summary
console.log(`Completed processing. Made ${changesCount} changes to date columns.`);

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
