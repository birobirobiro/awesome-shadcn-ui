const fs = require('fs');

const path = 'README.md';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const currentDate = new Date().toISOString().split('T')[0]; // e.g., 2023-10-15
const updatedLines = [];

let inTable = false;
let tableHasDateColumn = false;
let headerLineCount = 0;

for (const line of lines) {
  // Reset table state when hitting a new section
  if (line.startsWith('## ')) {
    inTable = false;
    tableHasDateColumn = false;
    headerLineCount = 0;
  }
  
  if (line.startsWith('|')) {
    if (!inTable) {
      // First line of a new table
      inTable = true;
      headerLineCount = 1;
      
      // Check if the table header has a date column
      const parts = line.split('|').map(part => part.trim());
      tableHasDateColumn = parts.includes('Date');
    } else {
      headerLineCount++;
    }
    
    const parts = line.split('|').map(part => part.trim());
    
    // Skip header and separator rows
    if (headerLineCount <= 2 || parts.some(p => p.startsWith('-'))) {
      updatedLines.push(line);
      continue;
    }
    
    // Handle data rows
    if (tableHasDateColumn) {
      // Table already has a date column, check if this row needs a date
      const lastColumn = parts[parts.length - 2]; // Get the last non-empty column
      if (!lastColumn || lastColumn === '') {
        // Replace the empty date with current date
        const newLine = line.replace(/\|\s*\|$/, `| ${currentDate} |`);
        updatedLines.push(newLine);
      } else {
        updatedLines.push(line); // Keep existing date
      }
    } else {
      // Table doesn't have a date column, add one
      updatedLines.push(line + ` ${currentDate} |`);
    }
  } else {
    updatedLines.push(line);
  }
}

fs.writeFileSync(path, updatedLines.join('\n'));
