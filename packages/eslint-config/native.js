import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginUnicorn from 'eslint-plugin-unicorn';
import { config as baseConfig } from './base.js';

/**
 * Shared ESLint configuration for React Native / Expo packages
 * (apps and shared UI library). Used as the single source of truth
 * so the same rules apply everywhere, whether run per-package or from
 * the repository root.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nativeConfig = defineConfig([
  ...baseConfig,
  expoConfig,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // New JSX transform makes React-in-scope unnecessary.
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      // TypeScript already validates component props.
      'react/prop-types': 'off',
    },
  },
  // Filename casing is a nudge, not a blocker: keep it as a warning so it
  // never blocks a commit (expo-router routes use lower/camel case).
  {
    files: ['**/*.ts'],
    plugins: { unicorn: pluginUnicorn },
    rules: {
      'unicorn/filename-case': ['warn', { case: 'camelCase' }],
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: { unicorn: pluginUnicorn },
    rules: {
      'unicorn/filename-case': [
        'warn',
        {
          case: 'pascalCase',
          ignore: ['^_layout\\.tsx$', '^\\[.*\\]\\.tsx$', '^index\\.tsx$'],
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  {
    // Generated gluestack-ui components are not hand-written code.
    ignores: ['dist/**', '.expo/**', 'node_modules/**', '**/src/components/ui/**'],
  },
]);
