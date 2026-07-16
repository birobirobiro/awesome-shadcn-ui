import { GITHUB_CONFIG, PR_TEMPLATE } from "@/lib/config";
import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

/**
 * Data submitted when creating a new resource PR.
 */
interface SubmissionData {
  name: string;
  description: string;
  url: string;
  category: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 250;

// Best-effort limiter: state is per server instance and resets on redeploy,
// which is enough to blunt scripted spam without external storage.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;
const submissionLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissionLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    submissionLog.set(key, recent);
    return true;
  }

  recent.push(now);
  submissionLog.set(key, recent);
  return false;
}

/**
 * Makes a user-supplied value safe to embed in a markdown table row,
 * commit message, and PR title: strips HTML tags and line breaks, escapes
 * pipe characters, and caps the length.
 */
function sanitizeMarkdownField(value: string, maxLength: number): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim();
}

/**
 * Validates and normalizes the submitted URL. Returns null unless it is a
 * well-formed http(s) URL. Parentheses are encoded so the URL cannot break
 * out of the markdown `[Link](...)` syntax.
 */
function sanitizeUrl(value: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }

  return parsed.toString().replace(/\(/g, "%28").replace(/\)/g, "%29");
}

/**
 * Resolves the GitHub user behind the request's bearer token, or null if
 * the request is unauthenticated or the token is invalid.
 */
async function getAuthenticatedLogin(
  request: NextRequest,
): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: authHeader,
      Accept: "application/vnd.github+json",
      "User-Agent": "awesome-shadcn-ui",
    },
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();
  return typeof user.login === "string" ? user.login : null;
}

/**
 * Result of attempting to insert a resource into the README.
 */
interface InsertResult {
  content: string;
  error?: string;
}

/**
 * Scans the entire README and returns a duplicate error if the submission's
 * name or URL already appears in any section. Checking globally (not just in
 * the target section) prevents the same resource from being listed twice
 * under different categories.
 */
function findGlobalDuplicate(
  lines: string[],
  submission: SubmissionData,
): string | null {
  const submittedName = submission.name.toLowerCase();
  const submittedUrl = submission.url.toLowerCase();
  let currentSection = "";

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentSection = line.replace(/^##\s+/, "").trim();
      continue;
    }

    if (!line.startsWith("|") || line.match(/^\|[\s-]+\|/)) {
      continue;
    }

    const parts = line.split("|").map((part) => part.trim());
    if (parts.length < 2) continue;

    const existingName = parts[1];
    // Skip header rows ("Name") and empty rows
    if (!existingName || existingName.toLowerCase() === "name") continue;

    if (existingName.toLowerCase() === submittedName) {
      return `Resource "${submission.name}" already exists in "${currentSection}".`;
    }

    const existingUrlMatch = line.match(/\[Link\]\(([^)]+)\)/);
    const existingUrl = existingUrlMatch ? existingUrlMatch[1].toLowerCase() : null;
    if (existingUrl && existingUrl === submittedUrl) {
      return `URL "${submission.url}" is already listed as "${existingName}" in "${currentSection}".`;
    }
  }

  return null;
}

/**
 * Inserts a new resource entry into the README markdown content.
 *
 * Features:
 * - Rejects duplicates (name or URL) found anywhere in the README
 * - Finds the correct category section
 * - Inserts alphabetically within that section
 * - Includes today's date in the entry
 *
 * @param readmeContent - Current README markdown content
 * @param submission - Resource data to insert
 * @returns Updated content or error message
 */
function insertResourceIntoReadme(
  readmeContent: string,
  submission: SubmissionData,
): InsertResult {
  const lines = readmeContent.split("\n");

  const duplicateError = findGlobalDuplicate(lines, submission);
  if (duplicateError) {
    return { content: "", error: duplicateError };
  }

  // Format: | Name | Description | Link | Date |
  const today = new Date().toISOString().split("T")[0];
  const newEntry = `| ${submission.name} | ${submission.description} | [Link](${submission.url}) | ${today} |`;

  let insertIndex = -1;
  let inTargetSection = false;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Find the target category section
    if (
      line.startsWith("## ") &&
      line.toLowerCase().includes(submission.category.toLowerCase())
    ) {
      inTargetSection = true;
      continue;
    }

    // Exit if we've passed the target section
    if (
      inTargetSection &&
      line.startsWith("## ") &&
      !line.toLowerCase().includes(submission.category.toLowerCase())
    ) {
      break;
    }

    // Find the table header
    if (inTargetSection && line.startsWith("| Name")) {
      inTable = true;
      continue;
    }

    // Skip separator row
    if (inTable && line.match(/^\|[\s-]+\|/)) {
      continue;
    }

    // Process table rows
    if (inTable && line.startsWith("|") && !line.match(/^\|[\s-]+\|/)) {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length >= 2) {
        const existingName = parts[1];

        // Find alphabetical insertion point
        if (existingName.toLowerCase() > submission.name.toLowerCase()) {
          insertIndex = i;
          break;
        }
      }
    }

    // End of table - insert at the end
    if (inTable && (!line.startsWith("|") || line.trim() === "")) {
      if (insertIndex === -1) {
        insertIndex = i;
      }
      break;
    }
  }

  if (insertIndex === -1) {
    return {
      content: "",
      error: `Could not find insertion point for category "${submission.category}".`,
    };
  }

  lines.splice(insertIndex, 0, newEntry);
  return { content: lines.join("\n") };
}

/**
 * Generates the PR body with formatted description and checklist.
 */
function generatePRBody(submission: SubmissionData, submitter: string): string {
  return `---
name: "feat: Add new awesome resource"
about: "Propose adding a new awesome resource related to shadcn/ui"
labels:
  - feature
---

## Describe the awesome resource you want to add

**What is it?**
${submission.description}

## **Which section does it belong to?**
- [x] ${submission.category}

## **Additional details (optional)**
Resource URL: ${submission.url}

Submitted by: @${submitter}

## **Checklist**
- [x] Resource is automatically sorted alphabetically within its section.
- [x] Duplicate checking is performed automatically.
- [x] Table formatting is handled automatically.
- [x] Includes a valid and working link to the resource.
- [x] Automatically assigned the correct section to the resource.
`;
}

/**
 * POST /api/submit-resource
 *
 * Creates a pull request to add a new resource to the awesome-shadcn-ui list.
 *
 * Flow:
 * 1. Validates submission data
 * 2. Fetches current README from GitHub
 * 3. Inserts new entry (alphabetically sorted, with duplicate checking)
 * 4. Creates a new branch
 * 5. Commits the updated README
 * 6. Creates a pull request
 *
 * @returns { success, prNumber, prUrl } on success
 * @returns { error } on failure
 */
export async function POST(request: NextRequest) {
  try {
    const rawSubmission: SubmissionData = await request.json();

    const submitter = await getAuthenticatedLogin(request);
    if (!submitter) {
      return NextResponse.json(
        { error: "Sign in with GitHub to submit a resource" },
        { status: 401 },
      );
    }

    const ip =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (isRateLimited(`user:${submitter}`) || isRateLimited(`ip:${ip}`)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    }

    const submission: SubmissionData = {
      name: sanitizeMarkdownField(rawSubmission.name ?? "", MAX_NAME_LENGTH),
      description: sanitizeMarkdownField(
        rawSubmission.description ?? "",
        MAX_DESCRIPTION_LENGTH,
      ),
      url: sanitizeUrl(rawSubmission.url ?? "") ?? "",
      category: rawSubmission.category ?? "",
    };

    // Validate required fields
    if (!submission.name || !submission.description || !submission.category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!submission.url) {
      return NextResponse.json(
        { error: "Invalid URL format. Only http(s) URLs are accepted." },
        { status: 400 },
      );
    }

    if (
      !PR_TEMPLATE.CATEGORIES.includes(
        submission.category as (typeof PR_TEMPLATE.CATEGORIES)[number],
      )
    ) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const octokit = new Octokit({ auth: githubToken });

    // Step 1: Fetch current README
    const { data: readmeData } = await octokit.repos.getContent({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      path: "README.md",
    });

    if (
      Array.isArray(readmeData) ||
      !("content" in readmeData) ||
      !readmeData.sha
    ) {
      return NextResponse.json(
        { error: "Could not fetch README" },
        { status: 500 },
      );
    }

    const currentContent = Buffer.from(readmeData.content, "base64").toString();

    // Step 2: Insert resource into README
    const insertResult = insertResourceIntoReadme(currentContent, submission);

    if (insertResult.error) {
      return NextResponse.json({ error: insertResult.error }, { status: 409 });
    }

    const updatedContent = insertResult.content;
    const branchName = `add-${submission.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

    // Step 3: Get main branch reference
    const { data: ref } = await octokit.git.getRef({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      ref: "heads/main",
    });

    // Step 4: Create new branch
    await octokit.git.createRef({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });

    // Step 5: Commit updated README
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      path: "README.md",
      message: `feat: Add ${submission.name}`,
      content: Buffer.from(updatedContent).toString("base64"),
      sha: readmeData.sha,
      branch: branchName,
    });

    // Step 6: Create pull request
    const prBody = generatePRBody(submission, submitter);

    const { data: pr } = await octokit.pulls.create({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      title: `feat: Add ${submission.name}`,
      head: branchName,
      base: "main",
      body: prBody,
    });

    return NextResponse.json({
      success: true,
      prNumber: pr.number,
      prUrl: pr.html_url,
    });
  } catch (error: unknown) {
    console.error("Error creating PR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create pull request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
