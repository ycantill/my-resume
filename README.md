# My Resume

React version of the my-resume application with ultra-minimal design philosophy and environment-based configuration.

## 🎯 Philosophy

Zero UI chrome design - pure, professional resume content accessible via semantic URLs only. No navigation bars, toolbars, or interface elements.

## ✨ Features

- 📄 **Dynamic Resume Generator**: React + Firebase integration
- 🌍 **Multi-language Support**: English/Spanish via URL routing (`/en`, `/es`)
- 👥 **Environment-Based Person Selection**: Configure person via `VITE_PERSON` variable
- 🔗 **URL-Centric Navigation**: Direct URLs only
- 📱 **Responsive Design**: Print-optimized
- ⚡ **Real-time Updates**: Firebase Realtime Database
- 🎨 **Modern Styling**: Tailwind CSS
- 🌐 **Browser Language Detection**: Automatic language selection
- 🚨 **Fallback Page**: Helpful guidance when configuration is missing

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Firebase project with Realtime Database

### Installation

```bash
git clone <repository-url>
cd my-resume
npm install
```

### Configuration

1. **Firebase Setup**: Update `src/firebase-config.js` with your Firebase configuration.

2. **Person Configuration**: Set the person to display via environment variable:

```bash
# For development
VITE_PERSON=yohany npm run dev

# For building
VITE_PERSON=lenicet npm run build
```

### Development

```bash
# Show fallback page (no person configured)
npm run dev

# Show specific person's resume
VITE_PERSON=yohany npm run dev
VITE_PERSON=lenicet npm run dev
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

### Fallback Behavior

When `VITE_PERSON` is not set, the application displays a helpful fallback page explaining:

- How to set the environment variable
- Available persons (`yohany`, `lenicet`)
- Example commands for development and building

### Supported Values

- **Languages**: `en` (English), `es` (Spanish)
- **Persons**: `yohany`, `lenicet` (set via `VITE_PERSON`)

## 🏗️ Architecture

### Tech Stack

- **React 18** + TypeScript
- **Vite** (build tool)
- **React Router** (URL routing)
- **Firebase** (Realtime Database)
- **Tailwind CSS** (styling)

### Key Principles

- **URL as Single Source of Truth**: All state from URL parameters
- **Props-Driven Components**: No Context API
- **Zero UI Elements**: Pure content focus

### Component Structure

```
App → AppRouter → [PersonRequiredFallback | MyResume] → Resume Components
```

- **Without VITE_PERSON**: Shows fallback page explaining configuration
- **With VITE_PERSON**: Shows resume components receiving `language` as prop

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Development server (shows fallback without VITE_PERSON)
npm run build        # Production build (requires VITE_PERSON for full functionality)
npm run preview      # Preview build
npm run lint         # ESLint
npm run type-check   # TypeScript validation

# Environment-specific commands
VITE_PERSON=yohany npm run dev    # Development with specific person
VITE_PERSON=lenicet npm run build # Build for specific person
```

### Component Pattern

```typescript
interface ComponentProps {
  data: DataType;
  language: Language;
}

const Component: React.FC<ComponentProps> = ({ data, language }) => {
  const t = language;
  return <div>{t === 'en' ? 'English' : 'Español'}</div>;
};
```

### File Structure

```
src/
├── components/           # Resume components
│   ├── PersonRequiredFallback.tsx # Fallback when VITE_PERSON not set
│   ├── LoadingState.tsx  # Loading UI
│   ├── ErrorState.tsx    # Error handling
│   └── [other components...]
├── AppRouter.tsx        # Main routing (handles person validation)
├── MyResume.tsx         # Container component
├── firebase-service.ts  # Firebase integration
├── types.ts            # TypeScript definitions
└── main.tsx            # Entry point (reads VITE_PERSON)
```

## 🚀 Deployment

### Environment Configuration

For production deployment, you must specify the person to display:

```bash
# Build for specific person
VITE_PERSON=yohany npm run build
VITE_PERSON=lenicet npm run build
```

### GitHub Pages (Recommended)

**Automatic Deployment with Person Configuration:**

1. Set up GitHub Actions with environment variable
2. Repository Settings → Pages → Source: "GitHub Actions"
3. Configure deployment script to include `VITE_PERSON`

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
      - run: VITE_PERSON=yohany npm run build
      - uses: actions/deploy-pages@v2
        with:
          artifact_name: dist
```

### Firebase Database Structure

```
people/
├── [
│   {
│     "name": "yohany",
│     "personal": { ... },
│     "basics": { ... },
│     "work": [ ... ],
│     "education": [ ... ],
│     "languages": [ ... ],
│     "skills": [ ... ]
│   },
│   {
│     "name": "lenicet",
│     "personal": { ... },
│     "basics": { ... },
│     "work": [ ... ],
│     "education": [ ... ],
│     "languages": [ ... ],
│     "skills": [ ... ]
│   }
│ ]
```

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
```

## 🖨️ Printing

Navigate to desired URL and use browser print function (`Ctrl+P` / `Cmd+P`).

## 📄 License

MIT License - Feel free to use this project as a template for your own resume application.

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**

## 📄 License

MIT

## ✨ Features

- 📄 **Dynamic Resume Generator**: React-based with real-time Firebase integration
- 🌍 **Multi-language Support**: English/Spanish via URL routing (`/en/person`, `/es/person`)
- 👥 **Multiple Persons**: Support for different individuals (Yohany/Lenicet)
- 🔗 **URL-Centric Navigation**: Complete navigation through direct URLs only
- 📱 **Responsive Design**: Mobile-first approach with print optimization
- ⚡ **Real-time Updates**: Firebase Realtime Database integration
- 🎨 **Modern Styling**: Tailwind CSS utility-first framework
- ✨ **Zero UI Chrome**: Pure content focus without any interface elements
- 🌐 **Browser Language Detection**: Automatic language selection on first visit
- 🔄 **Legacy URL Support**: Backward compatibility with automatic redirection
- 🖨️ **Print-Optimized**: Professional layout for direct browser printing

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase project with Realtime Database

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd my-resume
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure Firebase:**
   - Update `src/firebase-config.js` with your Firebase configuration
   - Ensure Realtime Database is set up with appropriate data structure

4. **Start development server:**

```bash
npm run dev
```

5. **Open browser:**
   - Navigate to `http://localhost:3000`
   - Will automatically redirect to `/en/yohany` or your browser language

## 🛣️ URL Structure & Navigation

### Primary Access Pattern

```
/:language

Examples:
- /en → Resume in English (person determined by VITE_PERSON)
- /es → Resume in Spanish (person determined by VITE_PERSON)
```

### Environment-Based Person Selection

The person whose resume is displayed is determined at build/start time via the `VITE_PERSON` environment variable:

```bash
# Development examples
VITE_PERSON=yohany npm run dev  # Shows Yohany's resume
VITE_PERSON=lenicet npm run dev # Shows Lenicet's resume
npm run dev                     # Shows fallback page
```

### Automatic Redirections

- **Root (`/`)** → `/#/[browser-language]`
- **Direct language URLs** → Hash routing equivalent:
  - `/es` → `/#/es`
  - `/en` → `/#/en`
- **Invalid routes** → `/#/en` (fallback)

**Note**: GitHub Pages redirects are handled via `404.html` which converts clean URLs to hash routing.

### Supported Languages

- `en` - English
- `es` - Spanish (Español)

### Supported Persons

- `yohany` - Default person
- `lenicet` - Secondary person

## 💡 User Experience

### Ultra-Minimal Interface

- **Zero UI Elements**: No navigation, toolbars, or buttons
- **Pure Content**: Focus entirely on resume information
- **Professional Presentation**: Clean, distraction-free layout
- **Direct Access**: Every combination accessible via specific URL

### Navigation Methods

- **Primary**: Direct URL access or bookmarks
- **Language Switching**: Change URL from `/en` to `/es`
- **Person Switching**: Restart application with different `VITE_PERSON` value
- **Browser Navigation**: Full support for back/forward buttons

### Printing

1. Navigate to desired resume URL
2. Use browser print function:
   - **Windows/Linux**: `Ctrl + P`
   - **Mac**: `Cmd + P`
   - **Menu**: Browser Menu → Print
3. Layout automatically optimizes for professional printing

## 🏗️ Architecture

### Technology Stack

- **React 18**: Functional components with hooks
- **TypeScript**: Strict typing for better development experience
- **Vite**: Fast build tool and development server
- **React Router**: URL-based navigation and language routing
- **Firebase**: Realtime Database for dynamic content
- **Tailwind CSS**: Utility-first styling framework

### State Management Philosophy

- **URL as Single Source of Truth**: All state derived from URL parameters
- **Props-Driven Components**: No Context API, clean data flow
- **Real-time Firebase**: External data through custom hooks
- **Minimal State**: Only component-level state where necessary

### Component Architecture

```
App
├── AppRouter (URL routing & language detection)
└── MyResume (Main container)
    ├── LoadingState (Bilingual loading UI)
    ├── ErrorState (Bilingual error handling)
    └── Resume Components (All receive language as props)
        ├── BasicInfo (Contact information)
        ├── Summary (Professional summary)
        ├── WorkExperience (Job history with role grouping)
        ├── Education (Academic background)
        ├── Languages (Language skills)
        └── Skills (Technical skills by category)
```

### Key Technical Decisions

#### 1. URL-Centric Design

- **Before**: UI dropdowns + React Context for language/person state
- **After**: URL parameters only, props-driven components
- **Benefits**: Bookmarkable, shareable, SEO-friendly, stateless

#### 2. Zero UI Chrome Approach

- **Eliminated**: All toolbars, navigation elements, dropdowns
- **Result**: Pure content focus, professional appearance
- **Access**: Direct URLs only for ultimate simplicity

#### 3. Props vs Context

- **Before**: React Context API for global language state
- **After**: Language passed as props from URL parameters
- **Benefits**: Clearer data flow, easier testing, better performance

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run build:github # GitHub Pages build
npm run preview      # Preview production build
npm run lint         # ESLint checking
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier formatting
npm run type-check   # TypeScript validation
```

### Project Structure

```
src/
├── components/           # Resume components
│   ├── BasicInfo.tsx    # Contact information
│   ├── Summary.tsx      # Professional summary
│   ├── WorkExperience.tsx # Job history
│   ├── Education.tsx    # Education section
│   ├── Languages.tsx    # Language skills
│   ├── Skills.tsx       # Technical skills
│   ├── LoadingState.tsx # Loading UI (bilingual)
│   ├── ErrorState.tsx   # Error handling (bilingual)
│   ├── PersonRequiredFallback.tsx # Fallback page for missing VITE_PERSON
│   └── index.ts         # Component exports
├── AppRouter.tsx        # Main routing logic + person validation
├── MyResume.tsx         # Container component
├── firebase-config.js   # Firebase configuration
├── firebase-service.ts  # Firebase integration
├── resume-helpers.ts    # Utility functions
├── types.ts            # TypeScript definitions
├── index.css           # Tailwind configuration
└── main.tsx            # Application entry point + VITE_PERSON reading
```

### TypeScript Types

#### Core Types

```typescript
// Language support
type Language = 'en' | 'es';

// Localized content
interface LocalizedText {
  en: string;
  es: string;
}

// Personal contact information (separated from basics)
interface PersonalInfo {
  email: string;
  phone: string;
  location: BasicLocation;
}

// Basic resume information
interface ResumeBasics {
  name: string;
  label: LocalizedText;
  summary: LocalizedText;
  profiles: ContactProfile[];
}

// Complete resume data structure
interface ResumeData {
  personal: PersonalInfo; // New: separated contact info
  basics: ResumeBasics; // Updated: no longer contains contact info
  work: WorkEntry[];
  education: Education[];
  languages: LanguageEntry[];
  skills: Skill[];
}

// Component props pattern
interface ComponentProps {
  data: DataType;
  language: Language;
}
```

#### Work Experience Handling

- **Single Role**: Direct `WorkEntry` objects
- **Multiple Roles**: `GroupedWorkEntry` with `roles[]` array
- **Helper Function**: `groupWorkEntries()` processes mixed data

### Development Patterns

#### Component Creation

```typescript
// 1. Define props interface in types.ts
export interface ComponentProps {
  data: DataType;
  language: Language;
}

// 2. Create component receiving language
const Component: React.FC<ComponentProps> = ({ data, language }) => {
  const t = language;

  return (
    <section>
      <h2>{t === 'en' ? 'Title' : 'Título'}</h2>
      {/* component content */}
    </section>
  );
};

// 3. Use from parent with URL language
<Component data={data} language={currentLanguage} />
```

#### URL Parameter Access

```typescript
// Reading language from URL (person comes from environment)
const { language } = useParams<{ language?: string }>();
const currentLanguage = (language === 'es' ? 'es' : 'en') as Language;

// Reading person from app startup
const currentPerson = initialPerson; // passed via props from main.tsx
```

#### Environment Variable Access

```typescript
// In main.tsx - reading VITE_PERSON
const initialPerson = (import.meta.env.VITE_PERSON as string) || undefined;

// Passing to AppRouter
<AppRouter initialPerson={initialPerson} />
```

## 🚀 Deployment

### GitHub Pages (Recommended)

**Automatic Deployment:**

1. Push to `main` branch triggers GitHub Actions
2. Builds application and deploys to GitHub Pages
3. Available at `https://yourusername.github.io/my-resume/`

**Manual Setup:**

1. Repository Settings → Pages → Source: "GitHub Actions"
2. Update `vite.config.js` base path to match repository name
3. Push changes to trigger deployment

**Custom Domain (Optional):**

1. Rename `public/CNAME.template` to `public/CNAME`
2. Add your domain to the file
3. Configure DNS settings

### Other Platforms

The build output (`dist/`) is compatible with any static hosting service:

- Netlify, Vercel, Firebase Hosting, etc.
- Simply upload the `dist/` folder after running `npm run build`

## 🔥 Firebase Configuration

### Setup Requirements

```javascript
// src/firebase-config.js
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  databaseURL: 'https://your-project.firebaseio.com',
  projectId: 'your-project-id',
  // ... other config
};
```

### Database Structure

```
people/
├── [
│   {
│     "name": "yohany",
│     "personal": { ... },    # Contact information (email, phone, location)
│     "basics": { ... },      # Basic information (name, label, summary, profiles)
│     "work": [ ... ],        # Work experience
│     "education": [ ... ],   # Education background
│     "languages": [ ... ],   # Language skills
│     "skills": [ ... ]       # Technical skills
│   },
│   {
│     "name": "lenicet",
│     "personal": { ... },
│     "basics": { ... },
│     "work": [ ... ],
│     "education": [ ... ],
│     "languages": [ ... ],
│     "skills": [ ... ]
│   }
│ ]
```

**Note**: The database structure has evolved from `persons` object to `people` array, with each person identified by a `name` property. Personal contact information (`personal`) is separated from basic information (`basics`).

### Data Localization

All user-facing content uses the `LocalizedText` pattern:

```json
{
  "label": {
    "en": "Software Engineer",
    "es": "Ingeniero de Software"
  }
}
```

## 📈 Migration History

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

### Bundle Size Optimization

- **Before**: 22.39 kB CSS with complex UI
- **After**: 20.08 kB CSS (~10% reduction)
- **Components**: Eliminated Context providers and UI chrome
- **Performance**: Faster rendering, cleaner DOM structure

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

- Verify `firebase-config.js` settings
- Check database rules allow read access
- Ensure internet connectivity

**Language Not Displaying:**

- Check URL format: `/en` or `/es`
- Verify person is set via `VITE_PERSON` environment variable
- Verify person exists in Firebase data
- Check browser language detection for root URL

**Person Not Loading:**

- Ensure `VITE_PERSON` is set: `VITE_PERSON=yohany npm run dev`
- Verify person ID is valid (`yohany` or `lenicet`)
- Check fallback page for helpful configuration instructions

**Fallback Page Appearing:**

- This indicates `VITE_PERSON` is not set or invalid
- Set environment variable: `VITE_PERSON=yohany npm run dev`
- Check available persons in fallback page instructions

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
