# Development Guide

This guide covers the development setup, architecture, and configuration of the awesome-shadcn-ui website.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── github/        # GitHub device-flow OAuth
│   │   ├── preview-check/ # Website preview checks
│   │   └── submit-resource/ # Authenticated resource submissions
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── item-card.tsx     # Resource card component
│   └── pr-submission-dialog.tsx
├── hooks/                # Custom React hooks
│   ├── use-bookmark.ts   # Bookmark management
│   ├── use-debounce.ts   # Search debouncing
│   ├── use-github-auth.ts # GitHub OAuth flow
│   ├── use-pr-submission.ts # PR creation logic
│   └── use-readme.ts     # README parsing
├── lib/                  # Utilities & configuration
│   ├── config.ts         # Centralized config
│   └── utils.ts          # Helper functions
└── providers/            # React context providers
    ├── theme-provider.tsx
    └── providers.tsx
```

## Configuration

### Centralized Config (`src/lib/config.ts`)

Application constants are centralized in one file; runtime secrets and optional
analytics settings are supplied through environment variables:

```typescript
export const GITHUB_CONFIG = {
  CLIENT_ID: "Ov23lizgfZ4yKq0NxcTm",        // GitHub OAuth App
  REPO_OWNER: "birobirobiro",                // Repository owner
  REPO_NAME: "awesome-shadcn-ui",           // Repository name
  DEVICE_FLOW_URL: "https://github.com/login/device/code",
  ACCESS_TOKEN_URL: "https://github.com/login/oauth/access_token",
  SCOPES: ["read:user"],                    // Identify the submitting user
};

export const PR_TEMPLATE = {
  HEADER: { /* PR template structure */ },
  CATEGORIES: [ /* Available categories */ ],
  CHECKLIST_ITEMS: { /* Automated checklist */ }
};

export const ERROR_MESSAGES = { /* Error messages */ };
export const STATUS_MESSAGES = { /* Status messages */ };
```

## Key Features

### Resource Display
- **Source**: Fetches from GitHub README.md
- **Parsing**: `use-readme.ts` hook parses markdown tables
- **Caching**: 30-minute cache to reduce API calls
- **Categories**: Automatically groups by README sections

### Search & Filtering
- **Real-time search** with debouncing (300ms)
- **Category filtering** with URL state management
- **Layout switching** (compact, grid, row)
- **Bookmark system** with localStorage persistence

### PR Submission System
- **GitHub OAuth**: Device flow for secure authentication
- **Session-scoped access**: The user token is kept in `sessionStorage` for the current tab and removed on logout.
- **Automated workflow**:
  1. Verify the user's identity with the token returned by the device flow
  2. Validate the resource and find its README section
  3. Use the server's `GITHUB_TOKEN` to create a branch in this repository
  4. Update the README and open a pull request
- **Duplicate prevention**: Checks existing resources
- **Alphabetical sorting**: Maintains README organization

### GitHub Integration

#### OAuth Flow (`use-github-auth.ts`)
```typescript
// 1. Start device flow and poll for authorization
const { userCode, verificationUri } = await startDeviceFlow();

// 2. User authorizes on GitHub
// 3. The token is kept in sessionStorage for the current tab
// 4. The API uses it to verify the submitter before creating a PR
```

#### PR Creation (`use-pr-submission.ts`)
```typescript
// 1. Send the resource and user token to /api/submit-resource
// 2. The API verifies the user and validates the resource
// 3. The server token creates a branch in this repository
// 4. The API updates README.md and creates a pull request
```

## UI Components

### shadcn/ui Integration
- **Components**: Button, Dialog, Input, Select, Badge, etc.
- **Theming**: Dark/light mode with next-themes
- **Styling**: Tailwind CSS with custom design system
- **Accessibility**: Built-in ARIA support

### Custom Components
- **ItemCard**: Displays resource information
- **PRSubmissionDialog**: Handles GitHub authentication and form
- **LayoutSwitcher**: Toggle between view modes
- **SearchBar**: Real-time search with debouncing

## Data Flow

```
GitHub README.md → use-readme.ts → Resource[] → UI Components
                                    ↓
User Submission → PR Dialog → GitHub OAuth → PR Creation
```

## Development Workflow

### Adding New Features
1. **Hooks**: Add custom logic in `src/hooks/`
2. **Components**: Create reusable components in `src/components/`
3. **API**: Add endpoints in `src/app/api/`
4. **Config**: Update centralized config in `src/lib/config.ts`

### Environment Variables
```bash
# Required by /api/submit-resource to create branches and pull requests
GITHUB_TOKEN=your_github_token_here

# Optional Google Analytics measurement ID
NEXT_PUBLIC_GA_ID=
```

The server token must be able to create a branch, update `README.md`, and open a
pull request in the configured repository.

### Checks
```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Build check
pnpm build
```

## Dependencies

### Core
- **Next.js 16.3.6**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5.8.3**: Type safety

### UI & Styling
- **shadcn/ui**: Component library (Radix UI primitives)
- **Tailwind CSS 4.1.11**: Utility-first CSS
- **next-themes 0.4.6**: Theme management
- **Lucide React 0.509.0**: Icons
- **Motion 12.23.24**: Animations

### GitHub Integration
- **@octokit/rest 22.0.0**: GitHub API client
- **Device Flow OAuth**: Secure authentication

### Utilities
- **clsx 2.1.1**: Conditional classes
- **tailwind-merge 2.6.0**: Tailwind class merging
- **sonner 1.7.4**: Toast notifications
- **class-variance-authority 0.7.1**: Component variants
- **cmdk 1.0.0**: Command palette

## Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** following the existing patterns
4. **Test thoroughly** with different scenarios
5. **Submit PR** with clear description

## Architecture Decisions

### Why Device Flow OAuth?
- **Security**: No client secrets in frontend
- **User-friendly**: No redirects, works everywhere
- **Temporary**: One-time access, no permanent storage

### Why Centralized Config?
- **Maintainability**: Single source of truth
- **Type Safety**: TypeScript constants
- **Consistency**: Same values across all files

### Why README as Data Source?
- **User Readme View**: Easily User Viewable
- **Simplicity**: No database required
- **Version Control**: Changes tracked in Git
- **Transparency**: Public data source
