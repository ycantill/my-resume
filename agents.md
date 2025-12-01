# Agents Documentation

This document provides context for AI agents working on the My Resume React application.

## 📖 Primary Documentation

**⚠️ IMPORTANT**: All comprehensive project documentation is consolidated in `README.md`. Please refer to the README.md file for:

- Complete feature list and architecture overview
- URL structure and routing patterns
- Component architecture and state management patterns
- Development guidelines and best practices
- TypeScript types and interfaces
- Deployment instructions
- Firebase configuration
- Migration history and design philosophy

The README.md contains the single source of truth for all project documentation.

## 🎯 Quick Reference for Agents

### Project Overview

A dynamic resume generator built with React, TypeScript, and Firebase REST API featuring **zero UI chrome** design - pure content accessible via semantic URLs only.

### Key Architecture Points

- **URL-Centric**: All navigation through direct URLs (e.g., `/en`, `/es`)
- **Props-Driven**: No Context API for data, language passed via Context
- **Zero UI Elements**: No toolbars, buttons, or navigation - pure content only
- **Firebase REST API**: Lightweight data access without SDK dependency
- **Array-Based Data**: Firebase stores people as array, searched by `name` field
- **Bilingual Support**: URL-based language selection with browser detection
- **Person-Agnostic**: Works with any person ID configured in Firebase

### Current Component Structure

```
App → AppRouter → LanguageProvider → MyResume → [LoadingState|ErrorState|Resume Components]
```

All resume components use `useTranslation()` hook for bilingual content rendering.

### Routing Pattern

```
/:language
- /en, /es (person determined by VITE_PERSON environment variable)
- / → redirects to browser language
```

### Development Patterns

1. **Component Creation**: Define props interface in `types.ts`, use `useTranslation()` hook
2. **URL Parameter Access**: `useParams<{ language?: string; personId?: string }>()`
3. **Translation**: `const { t, language } = useTranslation(); return <div>{t('sections.summary')}</div>`
4. **Context-Driven**: Language state managed via LanguageContext + custom hook

### File Organization

- `src/components/` - All resume components (bilingual)
- `src/contexts/` - React contexts (LanguageContext)
- `src/hooks/` - Custom hooks (useTranslation)
- `src/locales/` - Translation JSON files (en.json, es.json)
- `src/AppRouter.tsx` - Main routing with language detection
- `src/MyResume.tsx` - Container component
- `src/types.ts` - All TypeScript interfaces
- `src/resume-helpers.ts` - Translation function and formatting utilities
- `src/api-service.ts` - Firebase REST API integration (no SDK)

## 🔧 Agent Guidelines

### When Working on This Project:

1. **Check README.md First**: All detailed documentation, examples, and patterns are there
2. **Follow URL-Centric Pattern**: Never add UI navigation elements
3. **Use Translation Hook**: Import and use `useTranslation()` for all text rendering
4. **Bilingual Everything**: All user-facing text must support en/es
5. **TypeScript Strict**: Use proper interfaces defined in `types.ts`
6. **Firebase REST API Only**: No SDK, use fetch-based `api-service.ts`
7. **Array-Based Data**: Firebase data is arrays searched by `name` field
8. **📝 Update Documentation**: After implementing important changes, update README.md to reflect:
   - New features or architectural changes
   - Modified environment variables or configuration
   - Changes to component structure or routing
   - New development patterns or best practices
   - Updated deployment instructions

### Component Update Pattern:

```typescript
// 1. Update interface in types.ts if needed (no language prop required)
interface ComponentProps {
  data: DataType;
}

// 2. Import and use useTranslation hook
import { useTranslation } from '../hooks/useTranslation';

const Component: React.FC<ComponentProps> = ({ data }) => {
  const { t, language } = useTranslation();

  // Use t() for static keys or LocalizedText objects
  return (
    <div>
      <h2>{t('sections.title')}</h2>
      <p>{t(data.description)}</p>
    </div>
  );
};

// 3. No need to pass language prop from parent
<Component data={data} />
```

**Special Cases**: Components rendered outside LanguageProvider (LoadingState, ErrorState, PersonRequiredFallback) receive `language` as prop and create local `t()` function.

### File Modification Guidelines:

- **types.ts**: Add/update interfaces for component props (no language parameter for most components)
- **components/\*.tsx**: Import and use `useTranslation()` hook
- **locales/en.json, es.json**: Add new translation keys for static UI text (use `databaseConfig.*` for DB errors)
- **MyResume.tsx**: Main container, wraps content in LanguageProvider
- **AppRouter.tsx**: Routing logic, language detection, URL validation
- **api-service.ts**: Firebase REST API calls (fetch-based, no SDK)
- **resume-helpers.ts**: Unified `t()` function handles both LocalizedText objects and string keys
- **.env.example**: Update when adding new environment variables
- **README.md**:
  - ⚠️ **ALWAYS update after important changes**
  - Document new features, configuration changes, or architectural modifications
  - Keep examples and code snippets current
  - Update environment variables section when adding new vars
  - Maintain accuracy in troubleshooting and deployment sections

### Documentation Update Triggers:

Update README.md when making changes to:

- ✅ Environment variables (`.env.example`, Database URL)
- ✅ Component architecture or routing structure
- ✅ New npm scripts or build commands
- ✅ Firebase database structure or security rules
- ✅ API service layer or data fetching logic
- ✅ Deployment process or configuration
- ✅ Development setup or prerequisites
- ✅ Error handling or fallback mechanisms

### Important Implementation Notes:

**Firebase Data Structure:**

- Public data: `/public/people` (array with indices 0, 1, 2...)
- Private data: `/private/contact` (array with indices 0, 1, 2...)
- Each object has `name` field used for matching `VITE_PERSON`
- REST API endpoints: `https://[PROJECT_ID].firebaseio.com/public/people.json`

**Environment Variables:**

```bash
VITE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_PERSON=yohany
VITE_SHOW_PRIVATE_INFO=false
```

**Data Fetching Pattern:**

```typescript
// Fetch entire array, then find by name
const response = await fetch(`${baseUrl}/public/people.json`);
const peopleArray = await response.json();
const person = peopleArray.find((p) => p?.name === personId);
```

**No Firebase SDK:**

- Do NOT import from 'firebase' package
- Do NOT reference `firebase-service.ts` or `firebase-config.ts` (deleted)
- Use `api-service.ts` with native fetch API

---

**For detailed implementation examples, patterns, and comprehensive documentation, always refer to README.md**
