const { execSync } = require('child_process');
const fs = require('fs');

console.log('Reading commit history for README.md...');

// --reverse: oldest to newest, so the FIRST commit that adds a row wins.
// -p: include patches. --format markers let us know which commit a hunk belongs to.
const output = execSync(
  'git log --reverse --format="COMMIT %H %aI" -p -- README.md',
  { encoding: 'utf8', maxBuffer: 500 * 1024 * 1024 }
);

const nameToTimestamp = new Map();
let currentTimestamp = null;
let inReadmeDiff = false;

for (const line of output.split('\n')) {
  if (line.startsWith('COMMIT ')) {
    const parts = line.split(' ');
    currentTimestamp = parts[2];
    inReadmeDiff = false;
    continue;
  }
  if (line.startsWith('diff --git')) {
    inReadmeDiff = line.includes('README.md');
    continue;
  }
  if (!inReadmeDiff) continue;
  if (!line.startsWith('+') || line.startsWith('+++')) continue;

  const content = line.slice(1);
  if (!content.startsWith('|')) continue;

  const parts = content.split('|').map((p) => p.trim());
  if (parts.length < 4) continue;

  const name = parts[1];
  if (!name || name === 'Name' || name.startsWith('---')) continue;
  if (nameToTimestamp.has(name)) continue;

  nameToTimestamp.set(name, currentTimestamp);
}

console.log(`Mapped ${nameToTimestamp.size} item names to commit timestamps.`);

const readme = fs.readFileSync('README.md', 'utf8');
const lines = readme.split('\n');

let inTable = false;
let dateColumnIndex = -1;
let headerLineCount = 0;
let updates = 0;
const unmatched = [];

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

  const name = parts[1].trim();
  if (!name) continue;

  // Skip rows that already have a full ISO timestamp (T separator present).
  const currentDateValue = parts[dateColumnIndex].trim();
  if (currentDateValue.includes('T')) continue;

  const timestamp = nameToTimestamp.get(name);
  if (!timestamp) {
    unmatched.push(name);
    continue;
  }

  parts[dateColumnIndex] = ` ${timestamp} `;
  lines[i] = parts.join('|');
  updates++;
}

fs.writeFileSync('README.md', lines.join('\n'));
console.log(`Updated ${updates} entries.`);
if (unmatched.length > 0) {
  console.log(`\nNo commit match for ${unmatched.length} items (kept original date):`);
  unmatched.slice(0, 30).forEach((n) => console.log(`  - ${n}`));
  if (unmatched.length > 30) console.log(`  ... and ${unmatched.length - 30} more`);
}
