const fs = require('fs');

// Fetches GitHub star counts for every resource in the README that links to a
// GitHub repository, and writes them to public/stars.json. The website merges
// this file into the resource list to power the "GitHub Stars" sort option.
//
// Requires a GITHUB_TOKEN env var (the default Actions token is enough).

const README_PATH = 'README.md';
const OUTPUT_PATH = 'public/stars.json';
const EXCLUDED_CATEGORIES = ['Star History', 'Contributors'];
const BATCH_SIZE = 100;

// Path roots on github.com that are never "owner" of a repository.
const NON_REPO_OWNERS = new Set([
  'orgs',
  'topics',
  'collections',
  'sponsors',
  'marketplace',
  'features',
  'about',
  'settings',
  'apps',
  'search',
  'trending',
]);

/**
 * Extracts a normalized "owner/repo" key from a URL, or null if the URL does
 * not point to a GitHub repository. Links to subpaths (tree/blob/releases)
 * resolve to their repository.
 */
function githubRepoFromUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (host !== 'github.com' && host !== 'www.github.com') return null;

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  const owner = segments[0];
  let repo = segments[1];
  if (NON_REPO_OWNERS.has(owner.toLowerCase())) return null;

  repo = repo.replace(/\.git$/i, '');
  if (!owner || !repo) return null;

  return `${owner}/${repo}`.toLowerCase();
}

/** Parses the README and returns the deduplicated list of repo keys. */
function collectRepos(content) {
  const repos = new Set();
  let currentCategory = '';

  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
      continue;
    }

    if (!line.startsWith('| ') || !currentCategory) continue;
    if (EXCLUDED_CATEGORIES.includes(currentCategory)) continue;

    const parts = line.split('|').map((part) => part.trim());
    if (parts.length < 4) continue;

    // Link column: [Link](url)
    const match = parts[3].match(/\[.*?\]\((.*?)\)/);
    if (!match || !match[1]) continue;

    const repo = githubRepoFromUrl(match[1]);
    if (repo) repos.add(repo);
  }

  return [...repos].sort();
}

/** Fetches stargazer counts for a batch of repos in a single GraphQL query. */
async function fetchStarsBatch(repos, token) {
  const fields = repos
    .map((repo, index) => {
      const [owner, name] = repo.split('/');
      return `r${index}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { stargazerCount }`;
    })
    .join('\n');

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'awesome-shadcn-ui-stars-updater',
    },
    body: JSON.stringify({ query: `query {\n${fields}\n}` }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  // Missing/renamed repos come back as null aliases plus NOT_FOUND errors;
  // that's expected, so only fail when there's no data at all.
  if (!payload.data) {
    throw new Error(`GraphQL returned no data: ${JSON.stringify(payload.errors)}`);
  }

  const stars = {};
  repos.forEach((repo, index) => {
    const node = payload.data[`r${index}`];
    if (node && typeof node.stargazerCount === 'number') {
      stars[repo] = node.stargazerCount;
    }
  });
  return stars;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN env var is required.');
    process.exit(1);
  }

  let content;
  try {
    content = fs.readFileSync(README_PATH, 'utf8');
  } catch (error) {
    console.error(`Error reading README.md: ${error.message}`);
    process.exit(1);
  }

  const repos = collectRepos(content);
  console.log(`Found ${repos.length} GitHub repositories in the README.`);

  const stars = {};
  for (let i = 0; i < repos.length; i += BATCH_SIZE) {
    const batch = repos.slice(i, i + BATCH_SIZE);
    const batchStars = await fetchStarsBatch(batch, token);
    Object.assign(stars, batchStars);
    console.log(`Fetched ${Object.keys(stars).length}/${repos.length} star counts...`);
  }

  const missing = repos.filter((repo) => !(repo in stars));
  if (missing.length > 0) {
    console.log(`No star count for ${missing.length} repos (moved/deleted): ${missing.join(', ')}`);
  }

  const output = {
    updatedAt: new Date().toISOString().slice(0, 10),
    stars: Object.fromEntries(Object.entries(stars).sort(([a], [b]) => a.localeCompare(b))),
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(stars).length} star counts to ${OUTPUT_PATH}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
