# Next.js App Directory Structure

This project uses Next.js App Router for routing and organization. The `app` directory contains all the components, styles, and logic for the application.

## Directory Structure

```
app/
├── components/         # Reusable components
│   ├── ui/             # UI components (buttons, inputs, etc.)
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Scrollable.tsx
│   │   └── index.ts    # Exports all UI components
│   └── [feature]/      # Feature-specific components
├── contexts/           # React contexts
├── dashboard/          # Dashboard page route
├── lib/                # Utility functions and helpers
│   └── utils/          # General utility functions
├── styles/             # Global and component-specific styles
│   └── scrollbar.css   # Custom scrollbar styles
├── globals.css         # Global CSS
├── layout.tsx          # Root layout component
└── page.tsx            # Home page component
```

## Component Organization

- **UI Components**: Basic, reusable UI elements like buttons, inputs, and loaders
- **Feature Components**: Components specific to a feature or section of the app
- **Page Components**: Components that represent a page or route in the app

## Importing Components

Import UI components from the index file:

```tsx
import { Button, LoadingSpinner, Scrollable } from '@/app/components/ui';
```

## Styling

- Global styles are in `globals.css`
- Component-specific styles are in the `styles` directory
- We use Tailwind CSS for styling components

## Naming Conventions

- Component files: PascalCase (e.g., `Button.tsx`)
- Utility files: camelCase (e.g., `formatDate.ts`)
- Directory names: camelCase (e.g., `components/ui/`)
- Route directories: kebab-case (e.g., `user-settings/`)

## Best Practices

- Keep components small and focused on a single responsibility
- Use TypeScript for type safety
- Export components as named exports from index files
- Use the App Router's built-in features for layouts, loading states, and error handling
