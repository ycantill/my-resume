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
- 🔒 **Privacy-First**: Separate public/private data with optional contact display

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

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Configure Firebase (get from [Firebase Console](https://console.firebase.google.com) → Project Settings):

   ```bash
   VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
   ```

3. Set person to display:
   ```bash
   VITE_PERSON=yohany  # or lenicet
   ```

### Development

```bash
# Show fallback page (no person configured)
npm run dev

# Show specific person's resume
npm run dev:yohany
npm run dev:lenicet
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

Without `VITE_PERSON`, shows helpful configuration guide with setup instructions.

**Supported Values:**

- **Languages**: `en`, `es`
- **Persons**: `yohany`, `lenicet`

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

All resume components receive `language` as prop for bilingual rendering.

## 🔧 Development

### Available Scripts

```bash
# Development servers
npm run dev                    # Base dev server (shows fallback without VITE_PERSON)
npm run dev:yohany             # Development with Yohany's resume
npm run dev:lenicet            # Development with Lenicet's resume
npm run dev:private:yohany     # Development with Yohany + private contact info
npm run dev:private:lenicet    # Development with Lenicet + private contact info

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

For production deployment, use the build script with environment variable:

```bash
# Build for GitHub Pages with specific person
VITE_PERSON=yohany npm run build:github
VITE_PERSON=lenicet npm run build:github
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
      - run: VITE_PERSON=yohany npm run build:github
      - uses: actions/deploy-pages@v2
        with:
          artifact_name: dist
```

### Firebase Database Structure

#### Public Data Structure

```json
public/
└── people/
    ├── [0]
    │   ├── name: "yohany"
    │   ├── basics: { name, label, summary, profiles }
    │   ├── work: [ ... ]
    │   ├── education: [ ... ]
    │   ├── languages: [ ... ]
    │   └── skills: [ ... ]
    └── [1]
        ├── name: "lenicet"
        └── [same structure]
```

#### Private Data Structure (Optional)

```json
private/
└── contact/
    ├── [0]
    │   ├── name: "yohany"
    │   ├── email: "email@example.com"
    │   ├── phone: "+1 234 567 8900"
    │   └── location: { city, country, countryCode, region }
    └── [1]
        └── [same structure]
```

**Key Points:**

- **Separated Data**: Public resume info vs private contact details
- **Array Format**: Identified by `name` field matching person ID
- **Bilingual Content**: - **Bilingual Content**: All user-facing text uses `{ "en": "...", "es": "..." }` format

### Privacy & Contact Information

#### Display Modes

**Public Mode (Default - Production):**

- Shows: Name, title, summary, work, education, skills, social profiles
- Private contact info is **not accessed** from Firebase

**Private Mode (Development Only):**

```bash
VITE_SHOW_PRIVATE_INFO=true npm run dev
```

- ✅ Shows email, phone, and location in gray container
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

These rules block `private/contact` access at database level. The environment variable is for development only.

### Environment Variables

```bash
# Required: Firebase configuration (JSON string from Firebase Console)
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}

# Required: Person identifier
VITE_PERSON=yohany

# Optional: Show private contact (development only, never in production)
VITE_SHOW_PRIVATE_INFO=false
```

See `.env.example` for template with placeholder values.

## 🖨️ Printing

### Environment Variables

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

- ✅ Fetches data from `private/contact` in Firebase
- ✅ Displays email, phone, and location
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

**Important**: With these rules, `private/contact` is completely inaccessible from the client. The `VITE_SHOW_PRIVATE_INFO` flag is for development only with appropriate Firebase rules.

### Environment Variables

```bash
# Required: Firebase configuration (JSON string from Firebase Console)
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}

# Required: Person identifier
VITE_PERSON=yohany

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

- Verify `VITE_FIREBASE_CONFIG` is set in `.env.local`
- Check the JSON format is valid (use a JSON validator)
- Check database rules allow read access
- Ensure internet connectivity

**Language Not Displaying:**

- Check URL format: `/en` or `/es`
- Verify `VITE_PERSON` is set in `.env.local`
- Verify person exists in Firebase data
- Check browser language detection for root URL

**Person Not Loading:**

- Ensure `VITE_PERSON` is set in `.env.local`
- Verify person ID is valid (`yohany` or `lenicet`)
- Check fallback page for helpful configuration instructions
- Restart dev server after changing `.env.local`

**Fallback Page Appearing:**

- This indicates `VITE_PERSON` is not set in `.env.local`
- Add `VITE_PERSON=yohany` to `.env.local`
- Restart the development server
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
