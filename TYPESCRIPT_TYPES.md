# TypeScript Types Documentation

## Improved TypeScript Implementation

Based on the actual Firebase data structure, the TypeScript types have been significantly improved for better type safety and development experience.

## Main Types

### Core Data Types

```typescript
// Language support
type Language = 'en' | 'es';

// Localized text structure
interface LocalizedText {
  en: string;
  es: string;
}

// Resume basics information
interface ResumeBasics {
  name: string;
  label: LocalizedText;
  email: string;
  summary: LocalizedText;
  location: BasicLocation;
  profiles: ContactProfile[];
}
```

### Work Experience Types

```typescript
// Work entry from Firebase
interface WorkEntry {
  name: string; // Company name
  position: LocalizedText; // Job title in both languages
  startDate: string; // Format: "YYYY-MM"
  endDate?: string; // Format: "YYYY-MM" (optional for current job)
  location: LocalizedText; // Location in both languages
  summary: LocalizedText; // Job description
  highlights: LocalizedHighlights; // Key achievements
  stack?: string[]; // Technologies used
}

// For companies with multiple roles (like Globant example in JSON)
interface GroupedWorkEntry {
  name: string;
  roles?: WorkRole[]; // Multiple positions at same company
  // OR single position properties
  position?: LocalizedText;
  startDate?: string;
  endDate?: string;
  location?: LocalizedText;
  summary?: LocalizedText;
  highlights?: LocalizedHighlights;
  stack?: string[];
}
```

### Error Handling

```typescript
// Structured error handling
interface ResumeDataError {
  code: 'PERSON_NOT_FOUND' | 'FIREBASE_ERROR' | 'NETWORK_ERROR' | 'INVALID_DATA';
  message: string;
  personId?: string;
  originalError?: Error;
}
```

## Enhanced Features

### 1. Type Guards and Validation

```typescript
// Runtime type checking
const isValidLanguage = (lang: string): lang is Language => {
  return lang === 'en' || lang === 'es';
};

const isValidPersonId = (id: string): id is PersonId => {
  return id === 'yohany' || id === 'lenicet';
};
```

### 2. Error Message Formatting

```typescript
// Localized error messages (defined in types.ts)
const formatErrorMessage = (error: ResumeDataError, language: Language): string => {
  // Returns appropriate error message based on user's language
};
```

### 3. Improved Hook Types

```typescript
// Enhanced usePersonData hook
interface UsePersonDataResult {
  data: ResumeData | null;
  loading: boolean;
  error: ResumeDataError | null; // Structured error instead of string
  refetch: () => Promise<void>;
}
```

## Data Structure Insights from Firebase JSON

### Persons Structure

The Firebase data shows two persons: `yohany` and `lenicet`, each with complete resume data.

### Work Experience Patterns

1. **Single Role Companies**: Most entries have one position per company
2. **Multiple Roles**: Globant shows multiple roles at the same company with different time periods
3. **Localized Content**: All user-facing text is available in English and Spanish

### Skills Organization

Skills are categorized by domain:

- Frontend Technologies
- Backend & Database
- DevOps & Tools
- Methodologies & Practices

## Benefits of Improved Types

1. **Better IntelliSense**: Autocomplete knows exact property names and structures
2. **Compile-time Validation**: Catches errors before runtime
3. **Self-documenting Code**: Types serve as living documentation
4. **Safer Refactoring**: TypeScript prevents breaking changes
5. **Enhanced Error Handling**: Structured errors with localization support

## Usage Examples

```typescript
// Component with typed props
const MyResume: React.FC<MyResumeProps> = ({ initialLang = 'es', initialPerson = 'yohany' }) => {
  const { data, loading, error } = usePersonData(initialPerson);

  if (error) {
    return <ErrorDisplay error={formatErrorMessage(error, initialLang)} />;
  }

  // TypeScript knows exact structure of data
  return <ResumeDisplay data={data} language={initialLang} />;
};
```

This implementation provides a robust, type-safe foundation for the resume application with excellent developer experience and runtime safety.
