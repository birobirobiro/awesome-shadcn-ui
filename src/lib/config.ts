// GitHub OAuth App Configuration
export const GITHUB_CONFIG = {
  // OAuth App Client ID - https://github.com/marketplace/awesome-shadcn-ui
  // Created by @BankkRoll, Feel free to swap it or use it
  CLIENT_ID: "Ov23lizgfZ4yKq0NxcTm",

  // Repository Configuration
  REPO_OWNER: "birobirobiro",
  REPO_NAME: "awesome-shadcn-ui",

  // OAuth App URLs
  DEVICE_FLOW_URL: "https://github.com/login/device/code",
  ACCESS_TOKEN_URL: "https://github.com/login/oauth/access_token",

  // API Configuration
  API_HEADERS: {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "awesome-shadcn-ui",
  },

  // OAuth Scopes
  SCOPES: ["repo"],

  // Fork Creation Delay (in milliseconds)
  FORK_CREATION_DELAY: 5000,
} as const;

// PR Template Configuration
export const PR_TEMPLATE = {
  HEADER: {
    name: "feat: Add new awesome resource",
    about: "Propose adding a new awesome resource related to shadcn/ui",
    labels: ["feature"],
  },

  SECTIONS: {
    DESCRIPTION: "## Describe the awesome resource you want to add",
    CATEGORY: "## **Which section does it belong to?**",
    ADDITIONAL_DETAILS: "**Additional details (optional)**",
    CHECKLIST: "## **Checklist**",
  },

  CATEGORIES: [
    "Libs and Components",
    "Plugins and Extensions",
    "Colors and Customizations",
    "Animations",
    "Tools",
    "Websites and Portfolios Inspirations",
    "Platforms",
    "Ports",
    "Design System",
    "Boilerplates / Templates",
  ],

  CHECKLIST_ITEMS: {
    AUTOMATED: [
      "Resource is automatically sorted alphabetically within its section.",
      "Duplicate checking is performed automatically.",
      "Table formatting is handled automatically.",
    ],
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GITHUB_API: "GitHub API error",
  FORK_CREATION: "Fork creation failed or is not accessible",
  BRANCH_CREATION: "Failed to create branch",
  README_FETCH: "Could not fetch README.md from original repository",
  PR_CREATION: "Failed to submit pull request",
  INVALID_ACTION: "Invalid action",
  INTERNAL_SERVER: "Internal server error",
} as const;

// Status Messages
export const STATUS_MESSAGES = {
  STARTING: "Starting submission process...",
  CHECKING_FORK: "Checking for repository fork...",
  USING_EXISTING_FORK: "Using existing fork...",
  CREATING_FORK: "Creating new fork...",
  VERIFYING_FORK: "Verifying fork is ready...",
  GETTING_COMMIT: "Getting latest commit from your fork...",
  CREATING_BRANCH: "Creating new branch on your fork...",
  READING_README: "Reading latest README for updates...",
  COMMITTING: "Committing your changes to the new branch...",
  CREATING_PR: "Creating pull request...",
} as const;
