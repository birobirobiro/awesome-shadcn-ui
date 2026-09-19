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

// ---- Duplicate check ----
//
// Secondary defense against duplicate entries across sections. The submission
// form (src/app/api/submit-resource/route.ts) also checks duplicates, but
// direct commits bypass it — this catches those.
//
// Exits non-zero if any resource name or URL appears in more than one row,
// which fails the format-readme workflow.

// ---- Missing link check ----
//
// The weekly lychee run only checks links that exist, so a row whose Link cell
// is empty — or whose columns are shifted, pushing prose into it — passes every
// check silently and ships a resource nobody can open.

const malformed = findMalformedRows(updatedLines);
if (malformed.length > 0) {
  console.error('\nRows without a usable link in README.md:');
  for (const row of malformed) {
    console.error(`  - ${row.section} → "${row.name}": ${row.reason}`);
  }
  console.error('\nEvery entry needs a third column of the form [Link](https://...).');
  process.exit(1);
}

const duplicates = findDuplicates(updatedLines);
if (duplicates.length > 0) {
  console.error('\nDuplicate entries detected in README.md:');
  for (const dup of duplicates) {
    console.error(`  - ${dup.kind} "${dup.value}" appears in:`);
    for (const occ of dup.occurrences) {
      console.error(`      • ${occ.section} → "${occ.name}"`);
    }
  }
  console.error('\nEach resource name and URL must be unique across the whole README.');
  process.exit(1);
}

function findMalformedRows(allLines) {
  const results = [];
  let currentSection = '(before first section)';

  for (const line of allLines) {
    if (line.startsWith('## ')) {
      currentSection = line.replace(/^##\s+/, '').trim();
      continue;
    }

    if (!line.startsWith('|') || line.match(/^\|[\s-]+\|/)) continue;

    const parts = line.split('|').map(p => p.trim());
    const name = parts[1];
    if (!name || name.toLowerCase() === 'name') continue;

    // A submitted row has 3 cells (the Date column is appended on merge by
    // add-dates), a merged one has 4. Either way the link sits in cell 3.
    const cellCount = parts.length - 2;
    if (cellCount < 3 || cellCount > 4) {
      results.push({ section: currentSection, name, reason: `has ${cellCount} columns, expected 3 or 4` });
      continue;
    }

    const linkCell = parts[3];
    if (!linkCell) {
      results.push({ section: currentSection, name, reason: 'the Link cell is empty' });
      continue;
    }

    if (!/^\[Link\]\(https?:\/\/[^)]+\)$/.test(linkCell)) {
      results.push({
        section: currentSection,
        name,
        reason: `the Link cell is not a link: "${linkCell.slice(0, 60)}"`,
      });
    }
  }

  return results;
}

function findDuplicates(allLines) {
  const byName = new Map();
  const byUrl = new Map();
  let currentSection = '(before first section)';

  for (const line of allLines) {
    if (line.startsWith('## ')) {
      currentSection = line.replace(/^##\s+/, '').trim();
      continue;
    }

    if (!line.startsWith('|') || line.match(/^\|[\s-]+\|/)) continue;

    const parts = line.split('|').map(p => p.trim());
    if (parts.length < 2) continue;

    const name = parts[1];
    // Skip header rows ("Name") and empty rows
    if (!name || name.toLowerCase() === 'name') continue;

    const nameKey = name.toLowerCase();
    if (!byName.has(nameKey)) byName.set(nameKey, []);
    byName.get(nameKey).push({ section: currentSection, name });

    const urlMatch = line.match(/\[Link\]\(([^)]+)\)/);
    if (urlMatch) {
      const urlKey = urlMatch[1].toLowerCase();
      if (!byUrl.has(urlKey)) byUrl.set(urlKey, []);
      byUrl.get(urlKey).push({ section: currentSection, name });
    }
  }

  const results = [];
  for (const [key, occurrences] of byName) {
    if (occurrences.length > 1) {
      results.push({ kind: 'name', value: key, occurrences });
    }
  }
  for (const [key, occurrences] of byUrl) {
    if (occurrences.length > 1) {
      results.push({ kind: 'URL', value: key, occurrences });
    }
  }
  return results;
}
