const fs = require('fs');

const readme = fs.readFileSync('README.md', 'utf8');
const lines = readme.split('\n');

let inTable = false;
let dateColumnIndex = -1;
let headerLineCount = 0;
let updates = 0;
let skipped = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('## ')) {
    inTable = false;
    dateColumnIndex = -1;
    headerLineCount = 0;
    continue;
  }

  if (!line.startsWith('|')) continue;

  if (!inTable) {
    inTable = true;
    headerLineCount = 1;
    const parts = line.split('|').map((p) => p.trim());
    dateColumnIndex = parts.findIndex((p) => p === 'Date');
    continue;
  }

  headerLineCount++;
  if (headerLineCount <= 2) continue;
  if (dateColumnIndex < 1) continue;

  const parts = line.split('|');
  if (parts.length <= dateColumnIndex) continue;

  const currentValue = parts[dateColumnIndex].trim();
  if (!currentValue || currentValue === 'Unknown') continue;

  // Skip day-only dates — we don't fabricate time precision we don't have.
  if (!currentValue.includes('T')) {
    skipped++;
    continue;
  }

  const date = new Date(currentValue);
  if (isNaN(date.getTime())) {
    skipped++;
    continue;
  }

  const normalized = date.toISOString();
  if (normalized === currentValue) continue;

  parts[dateColumnIndex] = ` ${normalized} `;
  lines[i] = parts.join('|');
  updates++;
}

fs.writeFileSync('README.md', lines.join('\n'));
console.log(`Normalized ${updates} dates to UTC ISO 8601 (Z suffix).`);
if (skipped > 0) console.log(`Skipped ${skipped} entries (day-only or invalid).`);
