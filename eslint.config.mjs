// ESLint flat config for the whole monorepo.
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['**/dist/**', '**/coverage/**', '**/node_modules/**']),

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  // Node.js code: server, shared, and config files.
  {
    files: ['server/**/*.ts', 'shared/**/*.ts', '**/*.config.{ts,mjs,js}'],
    languageOptions: { globals: globals.node },
  },

  // Server source: type-aware rules (catch forgotten awaits on DB calls, etc.).
  {
    files: ['server/src/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      // Express 5 handles promises returned by route handlers, so async handlers are fine.
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { arguments: false } },
      ],
    },
  },

  // React client.
  {
    files: ['client/src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
  },

  // Design-system rule: components and features never use raw hex colours.
  // Colours come only from the tokens in client/src/styles/globals.css (bg-surface, text-muted…).
  {
    files: ['client/src/components/**/*.{ts,tsx}', 'client/src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{3,6}/]',
          message: 'Raw hex colour. Use a design token class (e.g. bg-surface, text-danger).',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,6}/]',
          message: 'Raw hex colour. Use a design token class (e.g. bg-surface, text-danger).',
        },
        {
          selector: 'JSXText[value=/#[0-9a-fA-F]{3,6}/]',
          message: 'Raw hex colour. Use a design token class (e.g. bg-surface, text-danger).',
        },
      ],
    },
  },
);
