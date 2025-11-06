# My Resume

React version of the my-resume application, migrated from Lit Element.

## Features

- 📄 Dynamic resume generator with React
- 🔥 Firebase Realtime Database integration
- 🌍 Multi-language support (English/Spanish)
- 👥 Multiple persons support (Yohany/Lenicet)
- 🖨️ Print-optimized layout
- 📱 Responsive design
- ⚡ Real-time data updates

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
cd my-resume
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:github` - Build for GitHub Pages deployment
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types (without emit)

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Setup:

1. **Repository Settings**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Update Base Path**:
   - Open `vite.config.js`
   - Update the base path to match your repository name:

   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/my-resume/' : '/',
   ```

3. **Push to Main Branch**:
   - Any push to the `main` branch will trigger automatic deployment
   - The workflow builds the app and deploys to GitHub Pages

#### Manual Deployment:

You can also trigger deployment manually:

- Go to the "Actions" tab in your repository
- Select "My Resume React Workflow"
- Click "Run workflow"

#### Custom Domain (Optional):

If you have a custom domain:

1. Rename `public/CNAME.template` to `public/CNAME`
2. Add your domain to the CNAME file
3. Configure DNS settings for your domain

## Migration from Lit Element

This React version maintains the same functionality as the original Lit Element application:

### Key Changes Made:

1. **Component Architecture**: Converted from Lit Element class to React functional component
2. **State Management**: Replaced Lit properties with React useState hooks and Context API
3. **Lifecycle**: Converted Lit lifecycle methods to React useEffect hooks
4. **Styling**: Migrated from Lit CSS to Tailwind CSS utility-first framework
5. **Firebase Integration**: Created custom React hooks for Firebase real-time updates
6. **Event Handling**: Converted to React event handlers

### Preserved Features:

- ✅ Firebase Realtime Database connectivity
- ✅ Multi-language support (en/es)
- ✅ Multi-person support (Yohany/Lenicet)
- ✅ Print functionality
- ✅ Real-time data synchronization
- ✅ All styling and layout
- ✅ Resume data structure and formatting

## Firebase Configuration

The Firebase configuration is located in `src/firebase-config.js`. Make sure your Firebase project is properly configured with Realtime Database.

## Project Structure

```
src/
├── components/           # Modular resume components
│   ├── index.ts         # Component exports
│   ├── LoadingState.tsx # Loading UI
│   ├── ErrorState.tsx   # Error handling UI
│   ├── Toolbar.tsx      # Language/person selector
│   ├── BasicInfo.tsx    # Contact information
│   ├── Summary.tsx      # Professional summary
│   ├── WorkExperience.tsx # Job history
│   ├── Education.tsx    # Education section
│   ├── Languages.tsx    # Language skills
│   └── Skills.tsx       # Technical skills
├── contexts/
│   └── LanguageContext.tsx # Global language state management
├── MyResume.jsx         # Main resume component
├── index.css           # Tailwind CSS configuration and custom components
├── firebase-config.js   # Firebase configuration
├── firebase-service.js  # Firebase service with React hooks
├── types.ts            # TypeScript type definitions
├── resume-helpers.js    # Utility functions for date formatting, etc.
└── main.jsx            # Application entry point
```

## License

MIT
