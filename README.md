# Common Bridging Folder (`lib/`)

This folder contains all shared business logic, hooks, utilities, and types that are commonly accessed across the application.

## Structure

```
lib/
├── hooks/           # Custom React hooks
├── services/        # Business logic and data management
├── types/           # TypeScript types and interfaces
├── utils/           # Utility functions
└── index.ts         # Main export point
```

## Usage

### Importing from the lib folder

You can import from the main entry point:

```typescript
import { useLocalStorage, useUserPreferences } from '@/lib';
import { LocalEvent, UserPreferences } from '@/lib';
import { getStorageItem, setStorageItem } from '@/lib';
import { saveEvent, getSavedEvents } from '@/lib';
```

Or import directly from specific modules:

```typescript
import { useLocalStorage } from '@/lib/hooks';
import { LocalEvent } from '@/lib/types';
import { eventService } from '@/lib/services';
```

## Modules

### Hooks (`lib/hooks/`)

Custom React hooks for common functionality:

- **`useLocalStorage`**: Manage localStorage with React state
- **`useUserPreferences`**: Manage user preferences with localStorage
- **`useAuth`**: Firebase authentication hook

### Services (`lib/services/`)

Business logic modules:

- **`eventService`**: Event management (save, remove, filter, search)
- **`userService`**: User data and preferences management
- **`authService`**: Firebase authentication service

### Types (`lib/types/`)

TypeScript types and interfaces:

- **`LocalEvent`**: Event data structure
- **`UserPreferences`**: User preference structure
- **`AppState`**: Application state structure
- **`AuthUser`**: Authenticated user structure
- **`RegisterData`**: User registration data
- **`LoginData`**: User login data
- **`STORAGE_KEYS`**: Type-safe storage key constants

### Utils (`lib/utils/`)

Utility functions:

- **`storage.ts`**: localStorage wrapper (SSR-safe)

## LocalStorage

All localStorage operations are handled through the `storage.ts` utility, which:
- Safely handles SSR (Server-Side Rendering)
- Provides type-safe operations
- Handles errors gracefully

## Best Practices

1. **Always use the lib folder** for shared logic - don't duplicate code
2. **Use TypeScript types** from `lib/types` for consistency
3. **Use services** for business logic, not components
4. **Use hooks** for React-specific state management
5. **Keep utilities pure** - no side effects in utility functions

