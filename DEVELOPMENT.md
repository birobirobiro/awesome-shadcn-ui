# Development Guide

This guide covers the development setup, architecture, and configuration of the awesome-shadcn-ui website.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── github/        # GitHub OAuth & PR submission
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

All configuration is centralized in one file:

```typescript
export const GITHUB_CONFIG = {
  CLIENT_ID: "Ov23lizgfZ4yKq0NxcTm",        // GitHub OAuth App
  REPO_OWNER: "birobirobiro",                // Repository owner
  REPO_NAME: "awesome-shadcn-ui",           // Repository name
  DEVICE_FLOW_URL: "https://github.com/login/device/code",
  ACCESS_TOKEN_URL: "https://github.com/login/oauth/access_token",
  SCOPES: ["repo"],                         // Required permissions
  FORK_CREATION_DELAY: 5000,               // Delay for fork creation
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
- **One-time access**: No credential storage
- **Automated workflow**:
  1. Check/create user fork
  2. Create feature branch
  3. Update README with new resource
  4. Create pull request with template
- **Duplicate prevention**: Checks existing resources
- **Alphabetical sorting**: Maintains README organization

### GitHub Integration

#### OAuth Flow (`use-github-auth.ts`)
```typescript
// 1. Start device flow
const { userCode, verificationUri } = await startDeviceFlow();

// 2. User authorizes on GitHub
// 3. Poll for access token
// 4. Get user info and create authenticated Octokit
```

#### PR Creation (`use-pr-submission.ts`)
```typescript
// 1. Check/create fork
// 2. Create branch from latest commit
// 3. Fetch latest README from upstream
// 4. Insert new resource alphabetically
// 5. Commit changes
// 6. Create PR with template
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
# No environment variables required
# All config is in src/lib/config.ts
```

### Testing
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build check
npm run build
```

## Dependencies

### Core
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5.8.3**: Type safety

### UI & Styling
- **shadcn/ui**: Component library (Radix UI primitives)
- **Tailwind CSS 4.1.11**: Utility-first CSS
- **next-themes 0.4.6**: Theme management
- **Lucide React 0.509.0**: Icons
- **Framer Motion 11.0.0**: Animations

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
