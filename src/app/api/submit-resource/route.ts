import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const GITHUB_CONFIG = {
  REPO_OWNER: "birobirobiro",
  REPO_NAME: "awesome-shadcn-ui",
  BRANCH: "main",
};

interface SubmissionData {
  name: string;
  description: string;
  url: string;
  category: string;
}

function insertResourceIntoReadme(
  readmeContent: string,
  submission: SubmissionData,
): { content: string; error?: string } {
  const lines = readmeContent.split("\n");
  const newEntry = `| ${submission.name} | ${submission.description} | [Link](${submission.url}) |`;

  let insertIndex = -1;
  let inTargetSection = false;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      line.startsWith("## ") &&
      line.toLowerCase().includes(submission.category.toLowerCase())
    ) {
      inTargetSection = true;
      continue;
    }

    if (
      inTargetSection &&
      line.startsWith("## ") &&
      !line.toLowerCase().includes(submission.category.toLowerCase())
    ) {
      break;
    }

    if (inTargetSection && line.startsWith("| Name")) {
      inTable = true;
      continue;
    }

    if (inTable && line.match(/^\|[\s-]+\|/)) {
      continue;
    }

    if (inTable && line.startsWith("|") && !line.match(/^\|[\s-]+\|/)) {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length >= 2) {
        const existingName = parts[1];

        const existingUrlMatch = line.match(/\[Link\]\(([^)]+)\)/);
        const existingUrl = existingUrlMatch ? existingUrlMatch[1] : null;

        if (existingName.toLowerCase() === submission.name.toLowerCase()) {
          return {
            content: "",
            error: `Resource "${submission.name}" already exists in this section.`,
          };
        }

        if (
          existingUrl &&
          existingUrl.toLowerCase() === submission.url.toLowerCase()
        ) {
          return {
            content: "",
            error: `This URL already exists in this section.`,
          };
        }

        if (existingName.toLowerCase() > submission.name.toLowerCase()) {
          insertIndex = i;
          break;
        }
      }
    }

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

function generatePRBody(submission: SubmissionData): string {
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

## **Checklist**
- [x] Resource is automatically sorted alphabetically within its section.
- [x] Duplicate checking is performed automatically.
- [x] Table formatting is handled automatically.
- [x] Includes a valid and working link to the resource.
- [x] Automatically assigned the correct section to the resource.
`;
}

export async function POST(request: NextRequest) {
  try {
    const submission: SubmissionData = await request.json();

    if (
      !submission.name ||
      !submission.description ||
      !submission.url ||
      !submission.category
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const octokit = new Octokit({ auth: githubToken });

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

    const insertResult = insertResourceIntoReadme(currentContent, submission);

    if (insertResult.error) {
      return NextResponse.json({ error: insertResult.error }, { status: 409 });
    }

    const updatedContent = insertResult.content;
    const branchName = `add-${submission.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

    const { data: ref } = await octokit.git.getRef({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      ref: "heads/main",
    });

    await octokit.git.createRef({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      path: "README.md",
      message: `feat: Add ${submission.name}`,
      content: Buffer.from(updatedContent).toString("base64"),
      sha: readmeData.sha,
      branch: branchName,
    });

    const prBody = generatePRBody(submission);

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
  } catch (error: any) {
    console.error("Error creating PR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create pull request" },
      { status: 500 },
    );
  }
}
