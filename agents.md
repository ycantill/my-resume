# Agents Documentation

This document provides context for AI agents working on the My Resume React application.

## Project Overview

A dynamic resume generator built with React, TypeScript, and Firebase. Supports multiple persons (Yohany/Lenicet) with multilingual content (English/Spanish).

## Architecture

### Core Technologies

- **React 18** with functional components and hooks
- **TypeScript** with strict type checking
- **Vite** for build tooling and development
- **Firebase Realtime Database** for data storage
- **Tailwind CSS** for utility-first component styling

### State Management

- **React Context** for global language state (`LanguageContext`)
- **Local state** with `useState` for component-specific data
- **Custom hooks** for Firebase integration (`usePersonData`)

## Project Structure

```
src/
├── contexts/
│   └── LanguageContext.tsx     # Global language state management
├── components/                 # Modular resume components
│   ├── index.ts               # Component exports
│   ├── LoadingState.tsx       # Loading UI
│   ├── ErrorState.tsx         # Error handling UI
│   ├── Toolbar.tsx            # Language/person selector
│   ├── BasicInfo.tsx          # Contact information
│   ├── Summary.tsx            # Professional summary
│   ├── WorkExperience.tsx     # Job history
│   ├── Education.tsx          # Education section
│   ├── Languages.tsx          # Language skills
│   └── Skills.tsx             # Technical skills
├── types.ts                   # TypeScript type definitions
├── firebase-config.js         # Firebase configuration
├── firebase-service.ts        # Firebase integration & hooks
├── resume-helpers.ts          # Utility functions
├── MyResume.tsx              # Main container component
├── index.css                 # Tailwind CSS configuration
└── main.tsx                  # Application entry point
```

## Key Patterns & Conventions

### Component Architecture

- **Functional components** with TypeScript
- **React.FC** type for component definitions
- **Props interfaces** defined in `types.ts`
- **Tailwind CSS** for utility-first styling

```typescript
interface ComponentProps {
  data: SomeType;
}

const Component: React.FC<ComponentProps> = ({ data }) => {
  return <div className="container">{/* content */}</div>;
};
```

### State Management Patterns

- **React Context** for global state (language)
- **Custom hooks** for external data (Firebase)
- **Local state** for component-specific needs

```typescript
// Global language access
const { language, setLanguage } = useLanguage();

// Firebase data fetching
const { data, loading, error } = usePersonData(personId);
```

### Naming Conventions

- **camelCase** for variables and functions
- **PascalCase** for components and types
- **kebab-case** for CSS classes
- **English** for all variable names (Spanish only for UI text)

## Data Structure

### Firebase Schema

```
persons/
├── yohany/
│   ├── basics/
│   ├── work/
│   ├── education/
│   ├── languages/
│   └── skills/
└── lenicet/
    └── [same structure]
```

### Localization Pattern

All user-facing content uses `LocalizedText`:

```typescript
interface LocalizedText {
  en: string;
  es: string;
}

// Usage
const title = data.label[language]; // 'language' from context
```

### Work Experience Handling

- **Single roles**: Direct `WorkEntry` objects
- **Multiple roles**: `GroupedWorkEntry` with `roles[]` array
- **Helper function**: `groupWorkEntries()` processes the data

## Firebase Integration

### Service Layer (`firebase-service.ts`)

- **`getPersonData()`**: Async data fetching
- **`usePersonData()`**: React hook with real-time updates
- **Caching**: In-memory cache for performance
- **Error handling**: Structured `ResumeDataError` objects

### Database Paths

- **Persons**: `persons/{personId}`
- **Real-time**: Uses Firebase `onValue` listeners
- **Read-only**: No write operations implemented

## Error Handling

### Structured Errors

```typescript
interface ResumeDataError {
  code: 'PERSON_NOT_FOUND' | 'FIREBASE_ERROR' | 'NETWORK_ERROR' | 'INVALID_DATA';
  message: string;
  personId?: string;
  originalError?: Error;
}
```

### Error Display

- **`ErrorState` component** for user-friendly error messages
- **Localized error messages** via `formatErrorMessage()`
- **Technical details** in collapsible sections

## Component Guidelines

### Props and Types

- All props interfaces defined in `types.ts`
- Use React Context to avoid prop drilling
- Prefer specific types over `any`

### Event Handling

```typescript
const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setValue(e.target.value);
};
```

### Styling

- **Tailwind CSS** utility-first framework
- **Custom component classes** in `@layer components`
- **Responsive design** with mobile-first approach and Tailwind breakpoints

## Development Patterns

### Component Creation

1. Define props interface in `types.ts`
2. Create functional component with `React.FC<Props>`
3. Import required context hooks
4. Export from `components/index.ts`

### TypeScript Usage

- **Strict mode** enabled
- **Type guards** for runtime validation
- **Generic types** for reusable interfaces
- **Union types** for constrained values

### Testing Considerations

- Components designed for testability
- Props interfaces enable easy mocking
- Error states explicitly handled

## Build & Deployment

### Scripts

- `npm run dev` - Development server (Vite)
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run type-check` - TypeScript validation

### Environment

- **Node.js 16+** required
- **Modern browsers** target (ES2020)
- **GitHub Pages** deployment ready

## Firebase Configuration

### Required Setup

- Firebase project with Realtime Database
- Configuration in `firebase-config.js`
- Database rules for read access

### Data Requirements

- Person objects with complete resume structure
- Localized content in `en`/`es` format
- Work experience with optional grouping

## Common Patterns to Follow

### 1. Language Context Usage

```typescript
const { language } = useLanguage();
const t = language; // Common pattern for readability
```

### 2. Firebase Data Fetching

```typescript
const { data: resumeData, loading, error } = usePersonData(personId);

if (loading) return <LoadingState />;
if (error) return <ErrorState error={error} />;
```

### 3. Component Structure

```typescript
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  const { language } = useLanguage();

  return (
    <section className="section-title">
      {/* component content */}
    </section>
  );
};
```

## Performance Considerations

- **Firebase caching** implemented in service layer
- **Context optimization** to prevent unnecessary re-renders
- **Component splitting** for better code organization
- **Tailwind CSS** for optimal bundle size

## Security Notes

- **Read-only Firebase access** - no write operations
- **Input validation** with TypeScript types
- **Error boundary** handling with structured errors
- **XSS protection** via React's default escaping

---

_This document should be updated when making significant architectural changes to maintain accuracy for AI agents._
