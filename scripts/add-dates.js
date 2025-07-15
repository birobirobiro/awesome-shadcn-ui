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

const currentDate = new Date().toISOString().split('T')[0]; // e.g., 2025-07-02
const updatedLines = [];
let changesCount = 0;
let malformedRows = 0;

console.log(`Processing README.md with ${lines.length} lines`);

// Function to validate ISO date format (YYYY-MM-DD)
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

let inTable = false;
let tableHasDateColumn = false;
let headerLineCount = 0;
let dateColumnIndex = -1;
let expectedColumnCount = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Reset table state when hitting a new section
  if (line.startsWith('## ')) {
    inTable = false;
    tableHasDateColumn = false;
    headerLineCount = 0;
    dateColumnIndex = -1;
    expectedColumnCount = -1;
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
      expectedColumnCount = parts.length - 2; // Exclude leading/trailing empty parts
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

    // Split the line while preserving whitespace
    let parts = line.match(/\|[^|]*/g)?.map(part => part.slice(1)) || [];
    
    // Handle rows missing the final '|' or with fewer columns
    if (parts.length - 1 < expectedColumnCount) {
      if (parts.length >= dateColumnIndex) {
        // Row has enough columns up to date column; append date
        if (parts.length === dateColumnIndex) {
          parts.push(`  ${currentDate}  `); // Add date column
          changesCount++;
        } else {
          const dateValue = parts[dateColumnIndex].trim();
          if (!dateValue || dateValue === '' || !isValidDate(dateValue)) {
            parts[dateColumnIndex] = `  ${currentDate}  `;
            changesCount++;
          } else {
            parts[dateColumnIndex] = `  ${dateValue}  `;
            if (parts[dateColumnIndex] !== `  ${dateValue}  `) {
              changesCount++;
            }
          }
        }
        // Ensure the row ends with a '|'
        const newLine = `|${parts.join('|')}|`;
        updatedLines.push(newLine);
      } else {
        console.warn(`Skipping malformed row at line ${i + 1}: ${line}`);
        malformedRows++;
        updatedLines.push(line);
      }
      continue;
    }

    // Handle data rows with correct column count
    if (tableHasDateColumn && dateColumnIndex > 0 && dateColumnIndex < parts.length) {
      const dateValue = parts[dateColumnIndex].trim();

      if (!dateValue || dateValue === '' || !isValidDate(dateValue)) {
        // Empty, whitespace, or invalid date: use current date with 2 spaces
        parts[dateColumnIndex] = `  ${currentDate}  `;
        const newLine = `|${parts.join('|')}`;
        updatedLines.push(newLine);
        changesCount++;
      } else {
        // Valid date: ensure 2 spaces on each side
        parts[dateColumnIndex] = `  ${dateValue}  `;
        const newLine = `|${parts.join('|')}`;
        updatedLines.push(newLine);
        if (parts[dateColumnIndex] !== `  ${dateValue}  `) {
          changesCount++;
        }
      }
    } else {
      console.warn(`Skipping row at line ${i + 1}: No date column or misaligned`);
      malformedRows++;
      updatedLines.push(line);
    }
  } else {
    // Not a table row
    updatedLines.push(line);
  }
}

// Log summary
console.log(`Completed processing. Made ${changesCount} changes to date columns.`);
if (malformedRows > 0) {
  console.warn(`Encountered ${malformedRows} malformed or misaligned rows.`);
}

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
