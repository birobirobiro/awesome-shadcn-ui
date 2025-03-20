const fs = require('fs');

const path = 'README.md';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const currentDate = new Date().toISOString().split('T')[0]; // e.g., 2023-10-15
const updatedLines = [];
let changesCount = 0;

console.log(`Processing README.md with ${lines.length} lines`);

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
      console.log(`Found table, has date column: ${tableHasDateColumn}, at index: ${dateColumnIndex}`);
    } else {
      headerLineCount++;
    }
    
    const parts = line.split('|');
    
    // Skip header and separator rows
    if (headerLineCount <= 2) {
      updatedLines.push(line);
      continue;
    }
    
    // Handle data rows
    if (tableHasDateColumn && dateColumnIndex > 0) {
      // Check if this row needs a date
      const dateValue = parts[dateColumnIndex].trim();
      
      if (!dateValue || dateValue === '') {
        // This row needs a date
        parts[dateColumnIndex] = ` ${currentDate} `;
        const newLine = parts.join('|');
        updatedLines.push(newLine);
        changesCount++;
        console.log(`Added date to row: ${parts[1].trim()}`);
      } else {
        // Row already has a date
        updatedLines.push(line);
      }
    } else {
      // No date column in this table
      updatedLines.push(line);
    }
  } else {
    // Not a table row
    updatedLines.push(line);
  }
}

console.log(`Made ${changesCount} changes to README.md`);

if (changesCount > 0) {
  fs.writeFileSync(path, updatedLines.join('\n'));
  console.log('Changes written to README.md');
} else {
  console.log('No changes needed, file not modified');
}
