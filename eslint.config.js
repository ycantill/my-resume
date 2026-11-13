import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Shared React rules for the app code, whether JavaScript or TypeScript
const reactConfig = {
  settings: { react: { version: '18.2' } },
  plugins: {
    react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results', 'blob-report'] },

  // Browser app code
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    ...reactConfig,
    rules: {
      ...reactConfig.rules,
      // `const { dropped, ...rest } = obj` is the idiomatic way to omit a key
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  // Tests may export helpers next to components and use test-only shortcuts
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Node-side code: build config, scripts and browser tests
  {
    files: ['*.{js,ts}', 'scripts/**/*.{js,mjs}', 'e2e/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
  },
)
