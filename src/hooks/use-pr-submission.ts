import {
  ERROR_MESSAGES,
  GITHUB_CONFIG,
  PR_TEMPLATE,
  STATUS_MESSAGES,
} from "@/lib/config";
import { Octokit } from "@octokit/rest";
import { useCallback, useState } from "react";

export interface SubmissionData {
  name: string;
  description: string;
  url: string;
  category: string;
}

export interface PRSubmissionResult {
  success: boolean;
  prNumber?: number;
  prUrl?: string;
  error?: string;
}

export function usePRSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const insertResourceIntoReadme = useCallback(
    (readmeContent: string, submission: SubmissionData): string => {
      const lines = readmeContent.split("\n");
      const newEntry = `| ${submission.name} | ${submission.description} | [Link](${submission.url}) |`;

      let insertIndex = -1;
      let inTargetSection = false;
      let inTable = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if we're in the target section
        if (
          line.startsWith("## ") &&
          line.toLowerCase().includes(submission.category.toLowerCase())
        ) {
          inTargetSection = true;
          continue;
        }

        // Check if we've moved to a new section
        if (
          inTargetSection &&
          line.startsWith("## ") &&
          !line.toLowerCase().includes(submission.category.toLowerCase())
        ) {
          // We've reached the end of our target section
          break;
        }

        // Check if we're in a table within our target section
        if (inTargetSection && line.startsWith("| Name")) {
          inTable = true;
          continue;
        }

        // Skip table header separator
        if (inTable && line.match(/^\|[\s-]+\|/)) {
          continue;
        }

        // Process table rows
        if (inTable && line.startsWith("|") && !line.match(/^\|[\s-]+\|/)) {
          const parts = line.split("|").map((part) => part.trim());
          if (parts.length >= 2) {
            const existingName = parts[1];

            // Check for duplicates
            if (existingName.toLowerCase() === submission.name.toLowerCase()) {
              throw new Error(
                `Resource "${submission.name}" already exists in this section.`,
              );
            }

            // Find alphabetical insertion point
            if (existingName.toLowerCase() > submission.name.toLowerCase()) {
              insertIndex = i;
              break;
            }
          }
        }

        // End of table
        if (inTable && (!line.startsWith("|") || line.trim() === "")) {
          // If we haven't found an insertion point yet, insert at the end of the table
          if (insertIndex === -1) {
            insertIndex = i;
          }
          break;
        }
      }

      if (insertIndex === -1) {
        throw new Error(
          `Could not find insertion point for category "${submission.category}".`,
        );
      }

      // Insert the new entry
      lines.splice(insertIndex, 0, newEntry);

      return lines.join("\n");
    },
    [],
  );

  const submitPR = useCallback(
    async (
      octokit: Octokit,
      submission: SubmissionData,
      userInfo: { login: string; name?: string },
    ): Promise<PRSubmissionResult> => {
      setIsSubmitting(true);
      setError(null);
      setSubmissionStatus(STATUS_MESSAGES.STARTING);

      try {
        const userLogin = userInfo.login;

        setSubmissionStatus(STATUS_MESSAGES.CHECKING_FORK);

        // Check if user already has a fork, create one if not
        let fork;
        try {
          // Try to get existing fork
          const { data: existingFork } = await octokit.rest.repos.get({
            owner: userLogin,
            repo: GITHUB_CONFIG.REPO_NAME,
          });
          fork = existingFork;
          setSubmissionStatus(STATUS_MESSAGES.USING_EXISTING_FORK);
        } catch (error: any) {
          if (error.status === 404) {
            // No fork exists, create one
            setSubmissionStatus(STATUS_MESSAGES.CREATING_FORK);
            const { data: newFork } = await octokit.rest.repos.createFork({
              owner: GITHUB_CONFIG.REPO_OWNER,
              repo: GITHUB_CONFIG.REPO_NAME,
            });
            fork = newFork;

            // A delay to allow GitHub's API to process the fork creation.
            await new Promise((resolve) =>
              setTimeout(resolve, GITHUB_CONFIG.FORK_CREATION_DELAY),
            );

            // Verify the fork is accessible
            setSubmissionStatus(STATUS_MESSAGES.VERIFYING_FORK);
            try {
              await octokit.rest.repos.get({
                owner: userLogin,
                repo: GITHUB_CONFIG.REPO_NAME,
              });
            } catch (verifyError: any) {
              throw new Error(
                `${ERROR_MESSAGES.FORK_CREATION}: ${verifyError.message}`,
              );
            }
          } else {
            throw error;
          }
        }

        setSubmissionStatus(STATUS_MESSAGES.GETTING_COMMIT);
        // Get the latest commit from the fork, not the upstream repo
        const { data: forkBranch } = await octokit.rest.repos.getBranch({
          owner: userLogin,
          repo: GITHUB_CONFIG.REPO_NAME,
          branch: "main",
        });
        const latestForkSha = forkBranch.commit.sha;

        setSubmissionStatus(STATUS_MESSAGES.CREATING_BRANCH);
        const branchName = `add-${submission.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

        try {
          // Create branch from the latest commit of the fork
          await octokit.rest.git.createRef({
            owner: userLogin,
            repo: GITHUB_CONFIG.REPO_NAME,
            ref: `refs/heads/${branchName}`,
            sha: latestForkSha,
          });
        } catch (branchError: any) {
          throw new Error(
            `${ERROR_MESSAGES.BRANCH_CREATION}: ${branchError.message}`,
          );
        }

        setSubmissionStatus(STATUS_MESSAGES.READING_README);
        // Get the README content from the original repository to ensure it's the latest version
        const { data: readmeData } = await octokit.rest.repos.getContent({
          owner: GITHUB_CONFIG.REPO_OWNER,
          repo: GITHUB_CONFIG.REPO_NAME,
          path: "README.md",
        });

        if (
          Array.isArray(readmeData) ||
          !("content" in readmeData) ||
          !readmeData.sha
        ) {
          throw new Error(ERROR_MESSAGES.README_FETCH);
        }
        const currentContent = Buffer.from(
          readmeData.content,
          "base64",
        ).toString();
        const latestReadmeSha = readmeData.sha;

        // Insert the new resource into the content
        const updatedContent = insertResourceIntoReadme(
          currentContent,
          submission,
        );

        setSubmissionStatus(STATUS_MESSAGES.COMMITTING);
        // Update README on the newly created branch using the upstream SHA
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: userLogin,
          repo: GITHUB_CONFIG.REPO_NAME,
          path: "README.md",
          message: `feat: Add ${submission.name}`,
          content: Buffer.from(updatedContent).toString("base64"),
          sha: latestReadmeSha,
          branch: branchName,
        });

        setSubmissionStatus(STATUS_MESSAGES.CREATING_PR);

        // Generate PR body using template
        const prBody = generatePRBody(submission, userInfo.login);

        const { data: pr } = await octokit.rest.pulls.create({
          owner: GITHUB_CONFIG.REPO_OWNER,
          repo: GITHUB_CONFIG.REPO_NAME,
          title: `feat: Add ${submission.name}`,
          head: `${userLogin}:${branchName}`,
          base: "main",
          body: prBody,
        });

        return {
          success: true,
          prNumber: pr.number,
          prUrl: pr.html_url,
        };
      } catch (err: any) {
        const errorMessage = err.message || ERROR_MESSAGES.PR_CREATION;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
        setSubmissionStatus(null);
      }
    },
    [insertResourceIntoReadme],
  );

  // Generate PR body using template
  const generatePRBody = (
    submission: SubmissionData,
    userLogin: string,
  ): string => {
    const { HEADER, SECTIONS, CHECKLIST_ITEMS } = PR_TEMPLATE;

    return `---
name: "${HEADER.name}"
about: "${HEADER.about}"
labels:
${HEADER.labels.map((label) => `  - ${label}`).join("\n")}
---

${SECTIONS.DESCRIPTION}

**What is it?**  
${submission.description}

${SECTIONS.CATEGORY}  
- [x] ${submission.category}

${SECTIONS.ADDITIONAL_DETAILS}  
Resource URL: ${submission.url}

${SECTIONS.CHECKLIST}
${CHECKLIST_ITEMS.AUTOMATED.map((item) => `- [x] ${item}`).join("\n")}

Submitted via website by @${userLogin}`;
  };

  return {
    isSubmitting,
    error,
    submissionStatus,
    submitPR,
  };
}
