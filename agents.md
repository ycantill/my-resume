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

A dynamic resume generator built with React, TypeScript, and Firebase featuring **zero UI chrome** design - pure content accessible via semantic URLs only.

### Key Architecture Points

- **URL-Centric**: All navigation through direct URLs (`/en/yohany`, `/es/lenicet`)
- **Props-Driven**: No Context API, language passed as props from URL params
- **Zero UI Elements**: No toolbars, buttons, or navigation - pure content only
- **Firebase Integration**: Real-time data through custom hooks
- **Bilingual Support**: URL-based language selection with browser detection

### Current Component Structure

```
App → AppRouter → MyResume → [LoadingState|ErrorState|Resume Components]
```

All resume components receive `language` as prop and render bilingual content.

### Routing Pattern

```
/:language/:person
- /en/yohany, /es/yohany
- /en/lenicet, /es/lenicet
- / → redirects to browser language + default person
```

### Development Patterns

1. **Component Creation**: Define props interface in `types.ts`, receive language as prop
2. **URL Parameter Access**: `useParams<{ language?: string; personId?: string }>()`
3. **Language Handling**: `const t = language; return t === 'en' ? 'English' : 'Español'`
4. **No Context API**: All state through URL parameters and props

### File Organization

- `src/components/` - All resume components (bilingual)
- `src/AppRouter.tsx` - Main routing with language detection
- `src/MyResume.tsx` - Container component
- `src/types.ts` - All TypeScript interfaces
- `src/firebase-service.ts` - Firebase integration hooks

## 🔧 Agent Guidelines

### When Working on This Project:

1. **Check README.md First**: All detailed documentation, examples, and patterns are there
2. **Follow URL-Centric Pattern**: Never add UI navigation elements
3. **Props Over Context**: Pass language as props, no global state
4. **Bilingual Everything**: All user-facing text must support en/es
5. **TypeScript Strict**: Use proper interfaces defined in `types.ts`
6. **Firebase Read-Only**: Only read operations, no write functionality
7. **📝 Update Documentation**: After implementing important changes, update README.md to reflect:
   - New features or architectural changes
   - Modified environment variables or configuration
   - Changes to component structure or routing
   - New development patterns or best practices
   - Updated deployment instructions

### Component Update Pattern:

```typescript
// 1. Update interface in types.ts if needed
interface ComponentProps {
  data: DataType;
  language: Language;
}

// 2. Update component to receive language
const Component: React.FC<ComponentProps> = ({ data, language }) => {
  const t = language;
  return <div>{t === 'en' ? 'English Text' : 'Texto Español'}</div>;
};

// 3. Pass language from parent
<Component data={data} language={currentLanguage} />
```

### File Modification Guidelines:

- **types.ts**: Add/update interfaces for component props
- **components/\*.tsx**: Ensure all receive and use language prop
- **MyResume.tsx**: Main container, passes language to all children
- **AppRouter.tsx**: Routing logic, language detection, URL validation
- **README.md**:
  - ⚠️ **ALWAYS update after important changes**
  - Document new features, configuration changes, or architectural modifications
  - Keep examples and code snippets current
  - Update environment variables section when adding new vars
  - Maintain accuracy in troubleshooting and deployment sections

### Documentation Update Triggers:

Update README.md when making changes to:

- ✅ Environment variables (`.env.example`, Firebase config)
- ✅ Component architecture or routing structure
- ✅ New npm scripts or build commands
- ✅ Firebase database structure or security rules
- ✅ Deployment process or configuration
- ✅ Development setup or prerequisites
- ✅ Error handling or fallback mechanisms

---

**For detailed implementation examples, patterns, and comprehensive documentation, always refer to README.md**
