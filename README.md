# My Resume

React version of the my-resume application with ultra-minimal design philosophy and environment-based configuration.

## 🎯 Philosophy

Zero UI chrome design - pure, professional resume content accessible via semantic URLs only. No navigation bars, toolbars, or interface elements.

## ✨ Features

- 📄 **Dynamic Resume Generator**: React + Firebase REST API integration
- 🌍 **Multi-language Support**: English/Spanish via URL routing (`/en`, `/es`)
-  **URL-Centric Navigation**: Direct URLs only
- 📱 **Responsive Design**: Print-optimized
- ⚡ **Lightweight Bundle**: Firebase REST API (no SDK dependency)
- 🎨 **Modern Styling**: Tailwind CSS + CSS Modules (scoped, BEM-aligned)
- 🧱 **Atomic Design**: Components organized as atoms → molecules → organisms → pages
- 🌐 **Browser Language Detection**: Automatic language selection
- 🚨 **Fallback Page**: Helpful guidance when configuration is missing
- 🔒 **Privacy-First**: Separate public/private data with optional contact display

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Firebase Realtime Database with public read access

### Installation

```bash
git clone <repository-url>
cd my-resume
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Configure Firebase Database URL (get from [Firebase Console](https://console.firebase.google.com) → Realtime Database):

   ```bash
   VITE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   ```

3. (Optional) Show private contact information:
   ```bash
   VITE_SHOW_PRIVATE_INFO=true  # Shows phone and location
   ```

### Development

```bash
# Start development server
npm run dev

# Show with private contact information (development only)
VITE_SHOW_PRIVATE_INFO=true npm run dev
```

## 🛣️ URL Structure

### New Simplified Structure

```
/#/:language

Examples:
- /#/en  → Resume in English (person set via VITE_PERSON)
- /#/es  → Resume in Spanish (person set via VITE_PERSON)
- /    → Redirects to browser language with hash routing
```

**Note**: The application uses hash routing for GitHub Pages compatibility. Direct URLs like `/es` automatically redirect to `/#/es`.

**Supported Values:**

- **Languages**: `en`, `es`

## 🏗️ Architecture

### Tech Stack

- **React 18** + TypeScript
- **Vite** (build tool)
- **React Router** (URL routing)
- **Firebase REST API** (Realtime Database access)
- **Tailwind CSS** (styling)
- **CSS Modules** (scoped component styles)
- **clsx** (conditional class composition)

### Key Principles

- **URL as Single Source of Truth**: All state from URL parameters
- **Context-Driven Translations**: Language state managed via React Context + custom hook
- **Zero UI Elements**: Pure content focus
- **Atomic Design**: Components organized by complexity level
- **BEM-Aligned CSS Modules**: Scoped styles with semantic naming

### Component Structure

```
App → AppRouter → MyResume → Resume Components
                      ↓
                Zustand Store (single source of truth)
```

All resume components use the `useTranslation()` hook for bilingual rendering.

### Atomic Design

Components are organized into four layers of complexity:

```
src/components/
├── atoms/          # Smallest indivisible UI units
│   └── Chip/       # Tag/badge element
├── molecules/      # Compositions of atoms
│   ├── ProfileLink/    # Social/contact link with icon
│   ├── LanguageItem/   # Single language with fluency
│   ├── SkillCategory/  # Skill group with chip list
│   ├── EducationCard/  # Single education entry
│   └── WorkRoleCard/   # Single role within a company
├── organisms/      # Full resume sections
│   ├── BasicInfo/
│   ├── Summary/
│   ├── WorkExperience/
│   ├── Education/
│   ├── Skills/
│   ├── Languages/
│   └── PersonalContact/
└── pages/          # Full-page states
    ├── LoadingState/
    ├── ErrorState/
    └── PersonRequiredFallback/
```

### CSS Architecture

Each component has its own `styles.module.css` file. The approach combines three complementary tools:

| Tool | Role |
|---|---|
| **CSS Modules** | Scoping — class names are hashed at build time, zero collisions |
| **BEM semantics** | Naming — module file = block, camelCase properties = elements/modifiers |
| **Tailwind `@apply`** | Styles — utility classes provide the actual CSS |
| **clsx** | Composition — combines module classes with global Tailwind classes |

**Naming convention:**

```css
/* styles.module.css — the file name IS the block */
.root { @apply p-6; }             /* block */
.headerTitle { @apply text-xl; }  /* block__element (camelCase) */
.badgeCurrent { @apply text-green-600; } /* block__element--modifier */
```

**Usage in components:**

```tsx
import { clsx } from 'clsx';
import styles from './styles.module.css';

// Module class only
<div className={styles.root}>

// Module class + global Tailwind utility class
<div className={clsx('section-card', styles.root)}>

// Conditional modifier
<span className={clsx(styles.badge, isCurrent && styles.badgeCurrent)}>
```

**Important**: Never name a CSS module class the same as a Tailwind utility you `@apply` inside it — e.g. `.grid { @apply grid }` causes a circular dependency error. Use a descriptive name instead (`.gridLayout { @apply grid }`).

### Translation System

**Architecture:**

- **JSON Translation Files**: `src/locales/en.json` and `src/locales/es.json`
- **Custom Hook**: `useTranslation()` provides `{ t, language }`
- **Unified Translation Function**: `t()` handles both Firebase objects and static text keys

**Usage Pattern:**

```typescript
// In any component
import { useTranslation } from '../hooks/useTranslation';

const Component: React.FC<ComponentProps> = ({ data }) => {
  const { t, language } = useTranslation();

  // Translate static UI text (string key)
  return (
    <div>
      <h2>{t('sections.summary')}</h2>
      {/* Translate Firebase data (LocalizedText object) */}
      <p>{t(data.summary)}</p>
    </div>
  );
};
```

**Translation Function Types:**

```typescript
// Static UI text (key lookup in JSON)
t('loading.title') → "Loading resume..." | "Cargando currículum..."

// Firebase data (LocalizedText object)
t({ en: "Engineer", es: "Ingeniero" }) → "Engineer" | "Ingeniero"
```

## 🔧 Development

### Available Scripts

```bash
# Development servers
npm run dev                            # Start development server
VITE_SHOW_PRIVATE_INFO=true npm run dev  # Development with private contact info

# Production builds
npm run build                  # Base build (requires VITE_PERSON for full functionality)
npm run build:github           # GitHub Pages build

# Utilities
npm run preview                # Preview production build
npm run lint                   # Run ESLint
npm run lint:fix               # Run ESLint with auto-fix
npm run format                 # Format code with Prettier
npm run type-check             # TypeScript validation
```

### Component Pattern

```typescript
import { useTranslation } from '../hooks/useTranslation';

interface ComponentProps {
  data: DataType;
}

const Component: React.FC<ComponentProps> = ({ data }) => {
  const { t, language } = useTranslation();

  // Use t() for static text keys
  return (
    <div>
      <h2>{t('sections.experience')}</h2>
      {/* Use t() for LocalizedText objects from Firebase */}
      <p>{t(data.description)}</p>
      {/* Access language when needed for helpers */}
      <span>{formatDate(data.startDate, language)}</span>
    </div>
  );
};
```

**Note**: Special components like `LoadingState`, `ErrorState`, and `PersonRequiredFallback` receive `language` as a prop and create a local `t()` function, since they render before the store is initialized.

### File Structure

```
src/
├── components/
│   ├── index.ts              # Barrel exports for all components
│   ├── atoms/
│   │   └── Chip/             # index.tsx + styles.module.css
│   ├── molecules/
│   │   ├── ProfileLink/
│   │   ├── LanguageItem/
│   │   ├── SkillCategory/
│   │   ├── EducationCard/
│   │   └── WorkRoleCard/
│   ├── organisms/
│   │   ├── BasicInfo/
│   │   ├── Summary/
│   │   ├── WorkExperience/
│   │   ├── Education/
│   │   ├── Skills/
│   │   ├── Languages/
│   │   └── PersonalContact/
│   └── pages/
│       ├── LoadingState/
│       ├── ErrorState/
│       └── PersonRequiredFallback/
├── hooks/
│   └── useTranslation.ts     # Translation hook
├── locales/
│   ├── en.json               # English translations
│   └── es.json               # Spanish translations
├── store/
│   └── useAppStore.ts        # Zustand store (language, resumeData, loading, error)
├── AppRouter.tsx             # Main routing with language detection
├── MyResume.tsx              # Container component, syncs URL → store
├── api-service.ts            # Firebase REST API integration (no SDK)
├── resume-helpers.ts         # Translation & formatting utilities
├── types.ts                  # TypeScript definitions
├── index.css                 # Global Tailwind layers (section-card, section-title, etc.)
└── main.tsx                  # Entry point
```

## 🚀 Deployment

### Environment Configuration

For production deployment, use the build script with environment variable:

```bash
# Build for GitHub Pages
npm run build:github
```

### GitHub Pages (Recommended)

**Automatic Deployment with Person Configuration:**

1. Set up GitHub Actions with environment variable
2. Repository Settings → Pages → Source: "GitHub Actions"
3. Configure deployment script with VITE_PERSON

**Example GitHub Action:**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:github
      - uses: actions/deploy-pages@v2
        with:
          artifact_name: dist
```

### Firebase Database Structure

**Important**: The application uses Firebase REST API to fetch data. Database rules must allow public read access to `/public`.

#### Public Data Structure

```json
public/
├── basics: { name, label, summary, profiles }
├── work: [ ... ]
├── education: [ ... ]
├── languages: [ ... ]
└── skills: [ ... ]
```

**REST API Endpoint**: `https://[PROJECT_ID].firebaseio.com/public.json`

#### Private Data Structure (Optional)

```json
private/
├── email: "person@example.com"
└── locations: [
      {
        "en": "Spain",
        "es": "España",
        "code": "ES",
        "timezone": "GMT+2",
        "phone": "+34662042004"
      },
      {
        "en": "Colombia",
        "es": "Colombia",
        "code": "COT",
        "timezone": "GMT-5",
        "phone": "+573004977509"
      }
    ]
```

**REST API Endpoint**: `https://[PROJECT_ID].firebaseio.com/private.json`

**Key Points:**

- **Single Person**: Database holds exactly one person's data
- **Multiple Locations**: A person can list several `locations`, each with its own phone and timezone
- **Separated Data**: Public resume info vs private contact details
- **Bilingual Content**: All user-facing text uses `{ "en": "...", "es": "..." }` format (LocalizedText interface)
- **Static UI Text**: Translated via JSON files in `src/locales/`
- **Location**: each entry has `en`/`es` names, `code` (ISO-ish country code), `timezone` (e.g. `GMT-5`), `phone`

#### Location URLs

The displayed location is selected from the URL, using a slug derived from the location's `en` name (lowercased, non-alphanumeric characters replaced with `-`):

```
https://ycantill.github.io/my-resume/#/en/spain
https://ycantill.github.io/my-resume/#/en/colombia
https://ycantill.github.io/my-resume/#/es/colombia
```

If the location segment is omitted (e.g. `#/en`) or doesn't match any entry in `locations`, the first location in the array is shown.

### Privacy & Contact Information

#### Display Modes

**Public Mode (Default - Production):**

- Shows: Name, title, summary, work, education, skills, social profiles
- Private contact info is **not accessed** from Firebase

**Private Mode (Development Only):**

```bash
VITE_SHOW_PRIVATE_INFO=true npm run dev
```

- ✅ Shows phone and location (country + timezone) in gray container
- ⚠️ **NEVER** enable in production

#### Firebase Security Rules

```json
{
  "rules": {
    "public": { ".read": true, ".write": false },
    "private": { ".read": false, ".write": false }
  }
}
```

These rules block `private` access at database level. The environment variable is for development only.

### Environment Variables

```bash
# Required: Firebase Realtime Database URL
VITE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Optional: Show private contact (development only, never in production)
VITE_SHOW_PRIVATE_INFO=false
```

See `.env.example` for template with placeholder values.

## 🖨️ Printing

### Privacy & Contact Information

#### Public Mode (Default)

By default, the application only displays public information:

- Name and professional title
- Professional summary
- Work experience
- Education
- Skills and languages
- Social profiles (LinkedIn, etc.)

**No private contact information** is shown or accessed from Firebase.

#### Private Mode (Optional - Development Only)

To show private contact information during development:

```bash
VITE_SHOW_PRIVATE_INFO=true npm run dev
```

When enabled:

- ✅ Fetches data from `private` in Firebase
    - ✅ Displays phone and location (country + timezone)
- ✅ Shows in a subtle gray container below basic info
- ⚠️ Should **NEVER** be enabled in production builds

#### Firebase Security Rules

Apply these rules to protect private data:

```json
{
  "rules": {
    "public": {
      ".read": true, // Anyone can read public data
      ".write": false // No one can write
    },
    "private": {
      ".read": false, // No one can read private data
      ".write": false // No one can write
    }
  }
}
```

**Important**: With these rules, `private` is completely inaccessible from the client. The `VITE_SHOW_PRIVATE_INFO` flag is for development only with appropriate Firebase rules.

### Environment Variables

```bash
# Required: Firebase Realtime Database URL
VITE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Optional: Show private contact (development only, never in production)
VITE_SHOW_PRIVATE_INFO=false
```

See `.env.example` for template with placeholder values.

````

**Key Changes in Database Structure:**

- Changed from `persons` object to `people` array
- Each person object includes a `name` property for identification
- Separated `personal` (contact info) from `basics` (bio/summary)
- Firebase service searches array by `name` field instead of using object keys

All user-facing content uses bilingual format:

```json
{
  "label": {
    "en": "Software Engineer",
    "es": "Ingeniero de Software"
  }
}
````

## 🖨️ Printing

Navigate to desired URL and use browser print function (`Ctrl+P` / `Cmd+P`).

## Migration History

### Evolution from Lit Element

This React version represents a complete architectural evolution:

#### **Phase 1: Framework Migration**

- ✅ Lit Element → React functional components
- ✅ Lit CSS → Tailwind CSS utility-first
- ✅ Lit properties → React hooks
- ✅ Custom Firebase integration

#### **Phase 2: URL-Based Navigation**

- ✅ Person selection via URL routing
- ✅ Eliminated person navigation UI
- ✅ Direct URL access pattern

#### **Phase 3: Interface Minimization**

- ✅ Removed print button (use browser print)
- ✅ Simplified toolbar to language-only
- ✅ Progressive UI reduction

#### **Phase 4: Language URL Migration**

- ✅ Language selection via URL routing
- ✅ Eliminated React Context API
- ✅ Props-driven component architecture
- ✅ Browser language detection

#### **Phase 6: Environment-Based Configuration**

- ✅ Person selection via environment variables
- ✅ Eliminated person URL routing
- ✅ Added fallback page for missing configuration
- ✅ Simplified URL structure to language-only

#### **Phase 9: Single-Person Flat Structure**

- ✅ Removed multi-person array structure from Firebase
- ✅ `VITE_PERSON` env var eliminated — database holds one person directly
- ✅ `/public.json` and `/private.json` fetched directly (no array search)
- ✅ Location simplified: removed `city` and `region`, added `timezone` (e.g. `GMT-5`)
- ✅ Removed `PersonRequiredFallback` page (no longer needed)

#### **Phase 7: Firebase REST API Migration**

- ✅ Migrated from Firebase SDK to REST API
- ✅ Removed 76 packages (Firebase SDK dependency eliminated)
- ✅ Simplified configuration from JSON object to single URL
- ✅ Reduced bundle size significantly
- ✅ Array-based data structure with name-based lookup
- ✅ Maintained all functionality with lighter footprint

#### **Phase 8: Atomic Design + CSS Modules**

- ✅ Reorganized all components into Atomic Design layers (atoms → molecules → organisms → pages)
- ✅ Extracted 5 new molecule components from organism internals (ProfileLink, LanguageItem, SkillCategory, EducationCard, WorkRoleCard)
- ✅ Migrated all CSS to CSS Modules (`.module.css`) — build-time scoped class names
- ✅ Adopted BEM-aligned camelCase naming: file = block, `styles.elementName` = element, `styles.elementNameModifier` = modifier
- ✅ Added `clsx` for composing module classes with global Tailwind utility classes
- ✅ Global Tailwind component classes (`section-card`, `section-title`) preserved in `index.css`

### Bundle Size Optimization

- **Initial CSS**: 22.39 kB with complex UI
- **After Minimization**: 20.08 kB CSS (~10% reduction)
- **After REST API**: Even smaller bundle (no Firebase SDK ~200KB+)
- **Components**: Eliminated Context providers and UI chrome
- **Performance**: Faster rendering, cleaner DOM structure, reduced network overhead

## 🎨 Design Philosophy

### Minimalism Principles

1. **Content First**: Resume information is the only visible element
2. **URL as Interface**: Navigation through semantic URLs only
3. **Professional Focus**: Zero distractions from content
4. **Print-Ready**: Optimized for professional document printing

### User Benefits

- **Instant Focus**: No learning curve, immediate content access
- **Professional Appearance**: Clean, uncluttered presentation
- **Universal Sharing**: Direct links to specific language/person combinations
- **Accessibility**: Screen reader friendly, keyboard navigable

### Technical Benefits

- **Simplified Architecture**: Clear data flow, easier maintenance
- **Better Performance**: Reduced bundle size, faster rendering
- **SEO Optimization**: Language-specific URLs for search engines
- **Stateless Design**: URL as single source of truth

## 🔍 Troubleshooting

### Common Issues

**Firebase Connection Errors:**

- Verify `VITE_DATABASE_URL` is set in `.env.local`
- Check database rules allow read access to `/public`
- Ensure internet connectivity
- Verify database URL format: `https://[PROJECT_ID].firebaseio.com` (no trailing slash)

**Language Not Displaying:**

- Check URL format: `/en` or `/es`
- Check browser language detection for root URL

**Resume Not Loading:**

- Restart dev server after changing environment variables (`npm run dev`)
- Verify Firebase REST API is accessible (test `VITE_DATABASE_URL/public.json` in browser)
- Check that Firebase database contains the expected flat structure

**Print Layout Issues:**

- Use browser's native print function (Ctrl+P / Cmd+P)
- Layout automatically optimizes for print media
- Test with print preview before printing

**URL Redirection Problems:**

- Legacy person-based URLs are no longer supported
- Use environment variable for person selection instead
- Invalid routes fallback to `/en`
- Check browser console for navigation errors

## 📄 License

MIT License - Feel free to use this project as a template for your own resume application.

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**
